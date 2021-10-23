var RPVerbose = false

const _InputNames = [  // must match NumOut below.
    { letter: "P", short: "Pompe", long: "M/A Pompe" },
    { letter: "C", short: "Chauf", long: "M/A Chauffage" },
    { letter: "R", short: "Sel Rg", long: "Traitement Sel Rouge" },
    { letter: "V", short: "Sel Vt", long: "Traitement Sel Vert" },
    { letter: "5", short: "", long: "" },
    { letter: "6", short: "", long: "" },
    { letter: "7", short: "", long: "" },
    { letter: "8", short: "", long: "" },
]

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
    InputNames: _InputNames,
}

export default RPConstants
