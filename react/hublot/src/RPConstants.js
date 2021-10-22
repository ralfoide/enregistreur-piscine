var RPVerbose = false

function _init() {
    window.RP = window.RP || {}
    //const isLocalhost = (disableLocalhost && window.location.hostname === "localhost")
    //RPVerbose = isLocalhost;
    RPVerbose = true
    _log("@@ Verbose: " + RPVerbose)
}

function _log(param) {
    if (RPVerbose) console.log("@@ " + param)
}

const RPConstants = {
    init: _init,
    log: _log,
    NumOut: 8,
    CurrentGetUrl: "http://192.168.1.60:8080/current",
    CurrentRefrehsMs: 5000,
    EventsGetUrl:  "http://192.168.1.60:8080/events",
    EventsRefreshMs: 10000,
}

export default RPConstants
