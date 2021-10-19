#!/usr/bin/python3

from http.server import BaseHTTPRequestHandler, HTTPServer
import logging
import pifacedigitalio
import time
import threading
import signal
import systemd.daemon

_HTTP_PORT = 8080
_NUM_OUT = 8
_running = True
_piface = None
_listeners = None
_httpd = None
_httpd_thread = None


class MyHandler(BaseHTTPRequestHandler):
    def _set_response(self):
        self.send_response(200)
        self.send_header('Content-type', 'text/html')
        self.end_headers()

    def do_GET(self):
        logging.info("GET request,\nPath: %s\nHeaders:\n%s\n", str(self.path), str(self.headers))
        self._set_response()
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

    logging.info("Setup PiFace")
    global _piface
    _piface = pifacedigitalio.PiFaceDigital()

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


