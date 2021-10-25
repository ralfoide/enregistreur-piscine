#!/usr/bin/python3
#
# RPiscine (RPi piscine) Piface service.
# - PiscineData : maintains piscine data (event + current state). Multithreaded with lock access.
# - MyHandler: port 8080 web server for REST GET API. Reads from PiscineData. Runs in _http_thread.
# - piface_monitor_async: Polls piface for changes every second. Writes to PiscineData. Runs in _piface_thread.
#
# Timestamps are local Unix epoch in seconds (not millis).
#
# Data gets saved in _data_dir (argument parser validates it exist).
# File name is rpiscine_yyyy-mm-dd_NN.txt
# File format is text.
# First line is a signature: rpiscine_v1\n
# One line per entry: %x<epoch> %x<state> %x<crc>\n (all numbers as hex without 0x).
# crc is a basic crc32 of the string(%x%x, epoch, state) representation.
#
# Existing file behavior:
# - if file does not exist, auto-create/
# - if file exists and doesn"t have the proper signature, add/increment the -N after the date.
# (that is: do not erase files which are not hours).
# - if file exists and has the proper signature, read it, append at the end.


from http.server import BaseHTTPRequestHandler, HTTPServer
from io import StringIO

import argparse
import binascii
import json
import logging
import os
import re
import time
import threading
import signal
import sys

_MOCK = False
_HAS_SYSTEMD = True
try:
    import systemd.daemon
except ModuleNotFoundError:
    _HAS_SYSTEMD = False

_HAS_PIFACE = True
try:
    import pifacedigitalio
except ModuleNotFoundError:
    _HAS_PIFACE = False
    _MOCK = True

_HTTP_PORT = 8080
_NUM_OUT = 8
_DUP_OUT = True  # true to duplicate input on output pins
_FILE_HEADER="rpiscine_v1"
_running = True
_piface = None
_data = None
_httpd = None
_httpd_thread = None
_piface_thread = None
_args = None
_mock_epoch = int(time.time())


def getEpoch():
    if _MOCK:
        global _mock_epoch
        _mock_epoch = _mock_epoch + 1
        return _mock_epoch    # mock for mock piface
    else:
        return int(time.time())

def injectMockEvents():
    if _MOCK:
        global _mock_epoch
        _tmp_epoch = _mock_epoch
        for i in range(0, _NUM_OUT):
            _mock_epoch = _tmp_epoch - 1800 - 3600*i
            _data.updatePin(i, 1)
            _mock_epoch = _tmp_epoch - 10 - 3600*i
            _data.updatePin(i, 0)
        _mock_epoch = _tmp_epoch


class MockPiFace:
    def __init__(self):
        logging.info("Using Mock PiFace IO")
        self.input_pins  = [ self ] * _NUM_OUT
        self.output_pins = [ self ] * _NUM_OUT
    
    def turn_on(self):
        pass

    def turn_off(self):
        pass

    def value(self):
        return _mock_epoch % 2


class PiscineData:
    def __init__(self):
        logging.info("Piscine data created")
        self.lock = threading.Lock()
        self.events = []  # { "state": _data.getState(), "epoch": 42 }
        self.state = 0
        self._filepath = None

    def getState(self):
        with self.lock:
            return self.state

    def getEvents(self):
        """ Returns up to 24-hour of events. """
        with self.lock:
            if len(self.events) == 0:
                return []
            ts_max = self.events[-1]["epoch"]
            ts_min = ts_max - 24*3600
            events = [ ev for ev in self.events if ev["epoch"] >= ts_min and ev["epoch"] <= ts_max ]
            return events

    def _set_to_int(self, val, pin_num, is_on):
        if is_on:
            return val | (1 << pin_num)
        else:
            return val & (0xFF - (1 << pin_num))

    def _get_from_int(self, val, pin_num):
        return (val & (1 << pin_num)) != 0
 
    def updatePin(self, pin_num, is_on):
        """ pin_num: 0.._NUM_OUT, is_on: Boolean. """
        new_evt = None
        with self.lock:
            st_old = self.state
            st_new = self._set_to_int(st_old, pin_num, is_on)
            if st_new != st_old:
                self.state = st_new
                new_evt = { "state": st_new, "epoch": getEpoch() }
                self.events.append(new_evt)
                if _DUP_OUT:
                    if self._get_from_int(self.state, pin_num):
                        _piface.output_pins[pin_num].turn_on()
                    else:
                        _piface.output_pins[pin_num].turn_off()
        if new_evt is not None:
            self._append_to_file(new_evt["epoch"], new_evt["state"])

    def readDataFile(self):
        # Use epoch to figure the proper data file path
        t = time.localtime(getEpoch())
        n = 0
        while True:
            fn = "rpiscine_%s-%s-%s_%02d.txt" % (t.tm_year, t.tm_mon, t.tm_mday, n)
            fp = os.path.join(_args.data_dir, fn)
            # Don"t load the file if already loaded.
            if self._filepath == fp:
                return
            # Create the file if it doesn"t exit.
            if not os.path.exists(fp) and self._create_file(fp):
                # Nothing to read since it"s a new file.
                self._filepath = fp
                return
            # If the file exist and is valid, read it.
            if self._read_file(fp):
                self._filepath = fp
                return
            # No success (file exist and is not good), try next file.
            n += 1
    
    def _append_to_file(self, epoch, state):        
        t = time.localtime(getEpoch())
        fn = "rpiscine_%s-%s-%s_" % (t.tm_year, t.tm_mon, t.tm_mday)
        if self._filepath is None or not self._filepath.startswith(fn):
            # No initial file or date has changed, read/create the new file
            self.readDataFile()
        # sanity check... this should work
        fp = self._filepath
        if not os.path.exists(fp):
            logging.error("Error writing to file '%s'", fp)
        with open(fp, "a") as f:
            s = "%x %x %x" % (epoch, state, self._crc(epoch, state))
            print(s, file=f)
            logging.debug("@@ Write to '%s': %s", fp, s)

    def _create_file(self, filepath):
        with open(filepath, "w") as f:
            print(_FILE_HEADER, file=f)  # print() adds a \n
        logging.info("New data file: %s", filepath)

    def _read_file(self, filepath) -> bool:
        # Returns True if file was valid and was inserted in event list (even if empty)
        with open(filepath, "r") as f:
            lines = f.readlines()
            if len(lines) > 0:
                head = lines.pop(0).strip()
                if head != _FILE_HEADER:
                    logging.debug("@@ Invalid header in '%s': '%s'", filepath, head)
                else:
                    n = 0
                    with self.lock:
                        pattern = re.compile(r"\b[0-9a-f]+", re.IGNORECASE)
                        for line in lines:
                            try:
                                line = line.strip()                        
                                # re \b matches the word boundary (including beginning of string)
                                # thus the following finds all sequences of numbers anywhere in the string.
                                numbers = pattern.findall(line)
                                if len(numbers) == 3:
                                    epoch = int(numbers[0], 16)
                                    state = int(numbers[1], 16)
                                    crc   = int(numbers[2], 16)
                                    if crc == self._crc(epoch, state):
                                        # This is a good entry
                                        n += 1
                                        self.events.append( { "state": state, "epoch": epoch } )
                                        continue
                                logging.debug("@@ Invalid line in '%s': '%s'", filepath, line)
                            except Exception:
                                logging.debug("@@ Invalid line in '%s': '%s'", filepath, line)
                    # This is a valid file, whether we read any lines or not.
                    with self.lock:
                        self.events.sort(key=lambda i: i["epoch"])
                    logging.debug("@@ Loaded %d entries from '%s'", n, filepath)
                    return True
        return False

    def _crc(self, epoch, state) -> int:
        return binascii.crc32(("%x%x" % (epoch, state)).encode("utf-8"))


class MyHandler(BaseHTTPRequestHandler):
    def _set_response(self, mimeType="text/html"):
        self.send_response(200)
        self.send_header("Content-type", mimeType)

    # Disable CORS errors
    def _end_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        super().end_headers()

    def do_GET(self):
        if self.path == "/download":
            self.do_download()
            return

        self._set_response()
        self._end_headers()
        data = None
        if self.path == "/current":
            data = { "state": _data.getState(), "epoch": getEpoch() }
        elif self.path == "/events":
            data = { "events": _data.getEvents(), "epoch": getEpoch() }

        if data:
            io = StringIO()
            json.dump(data, io)
            s = io.getvalue()
            self.wfile.write(s.encode("utf-8"))
        else:
            logging.debug("@@ Ignored GET request,\nPath: %s\nHeaders:\n%s\n", str(self.path), str(self.headers))
            self.wfile.write("GET request for {}".format(self.path).encode("utf-8"))

    def do_download(self):
        events = _data.getEvents()
        name = "rpiscine"
        if len(events) > 0:
            first_ts = events[0]["epoch"]
            t = time.localtime(first_ts)
            name += "_%s-%s-%s" % (t.tm_year, t.tm_mon, t.tm_mday)
        self._set_response("text/plain")
        self.send_header("Content-Disposition", "attachment; filename=\"%s.csv\"" % name)
        self._end_headers()
        for ev in events:
            s = ""
            st = ev["state"]
            for p in range(_NUM_OUT):
                mask = 1<<p
                if st & mask == 0:
                    s += "A,"
                else:
                    s += "M,"
            t = time.localtime(ev["epoch"])
            s += time.strftime("\"%Y-%m-%d %H:%M:%S\"\n", t)
            self.wfile.write(s.encode("utf-8"))
        logging.debug("@@ Download %d events", len(events))


def signal_handler(signum, frame):
    logging.info("Signal handler called with signal %s", signum)
    global _running
    _running = False

# def input_on(event):
#     logging.info("Input on: %s", event.pin_num)
#     event.chip.output_pins[event.pin_num].turn_on()

# def input_off(event):
#     logging.info("Input off: %s", event.pin_num)
#     event.chip.output_pins[event.pin_num].turn_off()

def parse_args():
    parser = argparse.ArgumentParser(description="RPiscine REST Service")
    parser.add_argument("-d", "--data-dir", required=True)
    parser.add_argument("--debug", action="store_true")
    global _args
    _args = parser.parse_args()
    logging.info("Data dir: %s", _args.data_dir)
    if not os.path.isdir(_args.data_dir):
        logging.error("Data directory does not exist: %s", _args.data_dir)
        sys.exit(1)

def setup():
    print("Setup logger")
    logging.basicConfig(level=logging.INFO)
    parse_args()
    if _args.debug:
        logging.getLogger(None).setLevel(level=logging.DEBUG)
    logging.info("Starting up")
    logging.info("Has systemd: %s, has piface: %s", _HAS_SYSTEMD, _HAS_PIFACE)
    signal.signal(signal.SIGINT, signal_handler)
    signal.signal(signal.SIGTERM, signal_handler)

    global _data
    _data = PiscineData()

    logging.info("Setup PiFace")
    global _piface
    if _HAS_PIFACE:
        _piface = pifacedigitalio.PiFaceDigital()
    else:
        _piface = MockPiFace()

    # Toggle all outputs to indicate the service has started.
    for p in range(_NUM_OUT):
        _piface.output_pins[p].turn_on()
    time.sleep(0.3)
    for p in range(_NUM_OUT):
        _piface.output_pins[p].turn_off()

    injectMockEvents()

    server_address = ( "", _HTTP_PORT )
    logging.info("Setup REST server at %s", server_address)
    global _httpd
    _httpd = HTTPServer(server_address, MyHandler)

    logging.info("Startup complete")
    # Tell systemd that our service is ready
    if _HAS_SYSTEMD:
        systemd.daemon.notify("READY=1")

def http_serve_forever_async():
    with _httpd:
        logging.info("Http server started")
        _httpd.serve_forever()
    logging.info("Http server stopped")

def piface_monitor_async():
    logging.info("Piface thread started")
    last = [ 0 ] * _NUM_OUT
    while _running:
        for p in range(_NUM_OUT):
            v = _piface.input_pins[p].value
            if v != last[p]:
                logging.info("Piface change: pin %s -> state %s", p, v)
                last[p] = v
                _data.updatePin(p, v != 0)
        time.sleep(1) 
    logging.info("Piface thread stopped")

def serv():
    logging.info("Start loop")
    _data.readDataFile()

    # Run the httpd server in a thread.
    # Note this will require synchronizing access to data.
    _httpd_thread = threading.Thread(target=http_serve_forever_async, daemon=True)
    _httpd_thread.start()

    _piface_thread = threading.Thread(target=piface_monitor_async, daemon=True)
    _piface_thread.start()

    # TBD replace by a threading.barrier?
    while _running:
        time.sleep(5)
    logging.info("End loop")

def cleanup():
    logging.info("Cleanup") 
    if _httpd is not None:
        _httpd.shutdown()
    if _httpd_thread is not None:
        _httpd_thread.join()
    if _piface_thread is not None:
        _piface_thread.join()
    print("End cleanup") 


if __name__ == "__main__":
    try:
        setup()
        serv()
    finally:
        cleanup()


