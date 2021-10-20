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
_running = True
_piface = None
_listeners = None
_data = None
_httpd = None
_httpd_thread = None

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
        self.events = ()  # { "state": _data.getState(), "epoch": 42 }
        self.state = 0

    def getState(self):
        with self.lock:
            return self.state

    def getEvents(self):
        with self.lock:
            return self.events
    
    def updatePin(self, pin_num, is_on):
        """ pin_num: 0.._NUM_OUT, is_on: Boolean. """
        with self.lock:
            if is_on:
                self.state = self.state | (1 << pin_num)
            else:
                self.state = self.state & (0xFF - (1 << pin_num))


class MyHandler(BaseHTTPRequestHandler):
    def _set_response(self):
        self.send_response(200)
        self.send_header('Content-type', 'text/html')
        self.end_headers()

    def do_GET(self):
        logging.info("GET request,\nPath: %s\nHeaders:\n%s\n", str(self.path), str(self.headers))
        self._set_response()
        data = None
        if self.path == "/current":
            data = { "state": _data.getState(), "epoch": 42 }
        elif self.path == "/last_events":
            data = { "events": _data.getEvents() }
        
        if data:
            io = StringIO()
            json.dump(data, io)
            s = io.getvalue()
            self.wfile.write(s.encode('utf-8'))
        else:
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
    global _httpd
    with _httpd:
        logging.info("Http server started")
        _httpd.serve_forever()
    logging.info("Http server stopped")

def serv():
    logging.info("Start serv")

    # Run the httpd server in a thread.
    # Note this will require synchronizing access to data.
    _httpd_thread = threading.Thread(target=http_serve_forever_async, daemon=True)
    _httpd_thread.start()

    while _running:
        logging.info("Hello from the Python Demo Service")
        time.sleep(15)
    logging.info("End serv")

def cleanup():
    logging.info("Cleanup") 
    if _listeners is not None:
        _listeners.deactivate()
    if _httpd is not None:
        _httpd.shutdown()
    if _httpd_thread is not None:
        _httpd_thread.join()
    print("End cleanup") 


if __name__ == "__main__":
    try:
        setup()
        serv()
    finally:
        cleanup()


