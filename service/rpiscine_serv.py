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
# File name is rpiscine_yyyy-mm_NN.txt (one per month)
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
import math
import os
import random
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
_DOWNLOAD_NUM_MONTHS = 6
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
        # generate 10 events for 0.5-5 hours each up to one year ago per input pin.
        one_year_sec = 365 * 24 * 3600
        max_hours_sec = 5 * 3600
        rnd = random.Random()
        for p in range(0, _NUM_OUT):
            for k in range (0, 10):
                _mock_epoch = _tmp_epoch - rnd.randint(0, one_year_sec)
                _data.updatePin(p, 1)
                _mock_epoch += rnd.randint(max_hours_sec / 10, max_hours_sec)
                _data.updatePin(p, 0)
        _mock_epoch = _tmp_epoch
        _data.reset()


class PiFaceWrapper:
    def __init__(self, piface):
        self._piface = piface

    def turn_off(self, pin_num):
        self._piface.output_pins[pin_num].turn_off()

    def turn_on(self, pin_num):
        self._piface.output_pins[pin_num].turn_on()

    def value(self, pin_num):
        return self._piface.input_pins[pin_num].value


class MockPiFace:
    def __init__(self):
        logging.info("Using Mock PiFace IO")
        self._state = [ 0 ] * _NUM_OUT

    def turn_off(self, pin_num):
        self._state[pin_num] = 0

    def turn_on(self, pin_num):
        self._state[pin_num] = 1

    def value(self, pin_num):
        return self._state[pin_num] # (math.floor(getEpoch() / 3600) + pin_num) % 2


class PiscineData:
    def __init__(self):
        logging.info("Piscine data created")
        self._lock = threading.Lock()
        self._events = []  # { "state": _data.getState(), "epoch": 42 }
        self._state = 0
        self._filepath = None

    # --- IO API ---

    def getState(self):
        with self._lock:
            return self._state

    def getEvents(self):
        """ Returns up to _DOWNLOAD_NUM_MONTHS of events. """
        # TBD should really be configured per call site (e.g. 24-hour for event log, 6 mo for download).
        with self._lock:
            if len(self._events) == 0:
                return []
            ts_max = self._events[-1]["epoch"]
            ts_min = ts_max - _DOWNLOAD_NUM_MONTHS * 31 * 24 * 3600
            evts = [ ev for ev in self._events if ev["epoch"] >= ts_min and ev["epoch"] <= ts_max ]
            return evts

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
        with self._lock:
            st_old = self._state
            st_new = self._set_to_int(st_old, pin_num, is_on)
            if st_new != st_old:
                self._state = st_new
                new_evt = { "state": st_new, "epoch": getEpoch() }
                self._events.append(new_evt)
                if _DUP_OUT:
                    if self._get_from_int(self._state, pin_num):
                        _piface.turn_on(pin_num)
                    else:
                        _piface.turn_off(pin_num)
        if new_evt is not None:
            self._append_to_file(new_evt["epoch"], new_evt["state"])

    # --- Storage API ---

    def reset(self):
        """Empties all events. Forgets last file read. Used to remove mock entries."""
        self._filepath = None
        self._events = []

    def initReadFiles(self, num_previous_months=12):
        """Reads all previous files, up to the number of months indicated."""
        epoch = getEpoch()
        # Crappy implementation that needs to be changed. This will fail with e.g. February.
        avg_month_epoch = math.floor(365 / 12 * 24 * 3600)
        epoch -= avg_month_epoch * num_previous_months
        for month in range(num_previous_months, -1, -1):
            self.readDataFile(epoch)
            epoch += avg_month_epoch

    def readDataFile(self, epoch=None):
        # Use epoch to figure the proper data file path
        if epoch is None:
            epoch = getEpoch()
        t = time.localtime(epoch)
        n = 0
        while True:
            fn = self._filename(t, n, "txt")
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

    def _filename(self, time_struct, n=-1, ext="") -> str:
        fn = "rpiscine_%s-%s_" % (time_struct.tm_year, time_struct.tm_mon)
        if n >= 0:
            fn += "%02d" % n
        if ext:
            fn += "." + ext
        return fn

    def _append_to_file(self, epoch, state):        
        t = time.localtime(getEpoch())
        fn = self._filename(t)
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
                    with self._lock:
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
                                        self._events.append( { "state": state, "epoch": epoch } )
                                        continue
                                logging.debug("@@ Invalid line in '%s': '%s'", filepath, line)
                            except Exception:
                                logging.debug("@@ Invalid line in '%s': '%s'", filepath, line)
                    # This is a valid file, whether we read any lines or not.
                    with self._lock:
                        self._events.sort(key=lambda i: i["epoch"])
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
    def end_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        super().end_headers()

    def do_GET(self):
        if self.path == "/download":
            self.do_download()
            return

        self._set_response()
        self.end_headers()
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
            # use last event to find the date for the filename
            ts = events[-1]["epoch"]
            t = time.localtime(ts)
            name += "_%s-%s-%s" % (t.tm_year, t.tm_mon, t.tm_mday)
        self._set_response("text/plain")
        self.send_header("Content-Disposition", "attachment; filename=\"%s.csv\"" % name)
        self.end_headers()
        #
        # CSV format, per column:
        # - date in YYYY/MM/DD format
        # - time in HH:MM:SS format (local time)
        # - for each channel: M or A (1 or 0)
        # - for each channel: delta hours in float point
        last_m = [ 0 ] * _NUM_OUT
        delta = [ 0 ] * _NUM_OUT

        header = "Date,Heure,"
        header += ",".join([ "\"Canal #%d\"" % (p+1) for p in range(_NUM_OUT) ])
        header += ",".join([ "\"Temps #%d\"" % (p+1) for p in range(_NUM_OUT) ])
        header += "\n"
        self.wfile.write(header.encode("utf-8"))

        for ev in events:
            s = ""
            e = ev["epoch"]
            t = time.localtime(e)
            s += time.strftime("%Y-%m-%d,%H:%M:%S,", t)

            st = ev["state"]
            for p in range(_NUM_OUT):
                mask = 1<<p
                if st & mask == 0:
                    s += "A,"
                    if last_m[p] > 0:
                        delta[p] = e - last_m[p]
                        last_m[p] = 0
                else:
                    s += "M,"
                    last_m[p] = e
            for p in range(_NUM_OUT):
                d = delta[p]
                if d > 0:
                    s += "%f," % (d / 3600.)
                    delta[p] = 0
                else:
                    s += ","
            s += "\n"
            self.wfile.write(s.encode("utf-8"))
        logging.debug("@@ Download %d events", len(events))


def signal_handler(signum, frame):
    logging.info("Signal handler called with signal %s", signum)
    global _running
    _running = False

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
        _piface = PiFaceWrapper(pifacedigitalio.PiFaceDigital())
    else:
        _piface = MockPiFace()

    # Toggle all outputs to indicate the service has started.
    for p in range(_NUM_OUT):
        _piface.turn_on(p)
    time.sleep(0.3)
    for p in range(_NUM_OUT):
        _piface.turn_off(p)

    injectMockEvents()
    _data.initReadFiles()

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
            v = _piface.value(p)
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


