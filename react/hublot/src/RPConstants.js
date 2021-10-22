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

function _getCurrentUrl() {
    return window.location.protocol + "//" + window.location.hostname + ":8080/current"
}

function _getEventsUrl() {
    return window.location.protocol + "//" + window.location.hostname + ":8080/events"
}

const RPConstants = {
    init: _init,
    log: _log,
    NumOut: 8,
    currentGetUrl: _getCurrentUrl,
    CurrentRefrehsMs: 5000,
    eventsGetUrl: _getEventsUrl,
    EventsRefreshMs: 20000,
}

export default RPConstants
