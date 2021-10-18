#!/usr/bin/python

import time
import signal
import systemd.daemon

_running = True

def signal_handler(signum, frame):
    print("Signal handler called with signal", signum)
    global _running
    _running = False


def serv():
    print("Starting up")
    signal.signal(signal.SIGINT, signal_handler)    
    signal.signal(signal.SIGTERM, signal_handler)    

    print("Startup complete")
    # Tell systemd that our service is ready
    systemd.daemon.notify("READY=1")

    time.sleep(10)
    while _running:
        print("Hello from the Python Demo Service")
        time.sleep(15)
    print("End serv")


if __name__ == "__main__":
    serv()

