#!/usr/bin/python3

import pifacedigitalio
import time
import signal
import systemd.daemon

_num_out = 8
_running = True
_piface = None
_listeners = None

def signal_handler(signum, frame):
    print("Signal handler called with signal", signum)
    global _running
    _running = False


def input_on(event):
    print("Input on: ", event.pin_num)
    event.chip.output_pins[event.pin_num].turn_on()


def input_off(event):
    print("Input off: ", event.pin_num)
    event.chip.output_pins[event.pin_num].turn_off()


def setup():
    print("Starting up")
    signal.signal(signal.SIGINT, signal_handler)    
    signal.signal(signal.SIGTERM, signal_handler)    

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
    for p in range(_num_out):
        _piface.output_pins[p].turn_on()
    time.sleep(0.1)
    for p in range(_num_out):
        _piface.output_pins[p].turn_off()

    print("Startup complete")
    # Tell systemd that our service is ready
    systemd.daemon.notify("READY=1")


def serv():
    time.sleep(10)
    while _running:
        print("Hello from the Python Demo Service")
        time.sleep(15)
    print("End serv")

def cleanup():
    print("Cleanup") 
    if _listeners is not None:
        _listeners.deactivate()
    print("End cleanup") 


if __name__ == "__main__":
    try:
        setup()
        serv()
    finally:
        cleanup()


