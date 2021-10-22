#!/usr/bin/python3

from http.server import BaseHTTPRequestHandler, HTTPServer
from io import StringIO

import json
import logging
import time
import threading
import signal

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

_HTTP_PORT = 8080
_NUM_OUT = 8
_DUP_OUT = True  # true to duplicate input on output pins
_running = True
_piface = None
_listeners = None
_data = None
_httpd = None
_httpd_thread = None
_piface_thread = None

def getEpoch():
    if _HAS_PIFACE:
        return int(time.time())
    else:
        return 42    # mock for mock piface


class MockPiFace:
    def __init__(self):
        logging.info("Using Mock PiFace IO")
        self.input_pins  = [ self ] * _NUM_OUT
        self.output_pins = [ self ] * _NUM_OUT
    
    def turn_on(self):
        pass

    def turn_off(self):
        pass


class PiscineData:
    def __init__(self):
        logging.info("Piscine data created")
        self.lock = threading.Lock()
        self.events = []  # { "state": _data.getState(), "epoch": 42 }
        self.state = 0

    def getState(self):
        with self.lock:
            return self.state

    def getEvents(self):
        with self.lock:
            return self.events

    def _set_to_int(self, val, pin_num, is_on):
        if is_on:
            return val | (1 << pin_num)
        else:
            return val & (0xFF - (1 << pin_num))

    def _get_from_int(self, val, pin_num):
        return (val & (1 << pin_num)) != 0
 
    def updatePin(self, pin_num, is_on):
        """ pin_num: 0.._NUM_OUT, is_on: Boolean. """
        with self.lock:
            st_old = self.state
            st_new = self._set_to_int(st_old, pin_num, is_on)
            if st_new != st_old:
                self.state = st_new
                self.events.append( { "state": st_new, "epoch": getEpoch() } )
                if _DUP_OUT:
                    if self._get_from_int(self.state, pin_num):
                        _piface.output_pins[pin_num].turn_on()
                    else:
                        _piface.output_pins[pin_num].turn_off()


class MyHandler(BaseHTTPRequestHandler):
    def _set_response(self):
        self.send_response(200)
        self.send_header('Content-type', 'text/html')
        self.end_headers()

    # Disable CORS errors
    def end_headers (self):
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

    def do_GET(self):
        self._set_response()
        data = None
        if self.path == "/current":
            data = { "state": _data.getState(), "epoch": getEpoch() }
        elif self.path == "/events":
            data = { "events": _data.getEvents(), "epoch": getEpoch() }

        if data:
            io = StringIO()
            json.dump(data, io)
            s = io.getvalue()
            self.wfile.write(s.encode('utf-8'))
        else:
            logging.info("GET request,\nPath: %s\nHeaders:\n%s\n", str(self.path), str(self.headers))
            self.wfile.write("GET request for {}".format(self.path).encode('utf-8'))


def signal_handler(signum, frame):
    logging.info("Signal handler called with signal %s", signum)
    global _running
    _running = False

def input_on(event):
    logging.info("Input on: %s", event.pin_num)
    event.chip.output_pins[event.pin_num].turn_on()

def input_off(event):
    logging.info("Input off: %s", event.pin_num)
    event.chip.output_pins[event.pin_num].turn_off()

def setup():
    print("Setup logger")
    logging.basicConfig(level=logging.INFO)
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

    ## Setup input event handlers
    #global _listeners
    #_listeners = pifacedigitalio.InputEventListener(chip=_piface)
    #for i in range(4):
    #    _listeners.register(i, pifacedigitalio.IODIR_ON,  input_on)
    #    _listeners.register(i, pifacedigitalio.IODIR_OFF, input_off)
    #_listeners.activate()

    # Toggle all outputs to indicate the service has started.
    for p in range(_NUM_OUT):
        _piface.output_pins[p].turn_on()
    time.sleep(0.3)
    for p in range(_NUM_OUT):
        _piface.output_pins[p].turn_off()

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
    if _listeners is not None:
        _listeners.deactivate()
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


