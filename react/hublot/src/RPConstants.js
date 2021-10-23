var RPVerbose = false

const _InputNames = [  // must match NumOut below.
    { letter: "P", short: "Pompe", long: "M/A Pompe" },
    { letter: "C", short: "Chauf", long: "M/A Chauffage" },
    { letter: "R", short: "Sel Rg", long: "Traitement Sel Rouge" },
    { letter: "V", short: "Sel Vt", long: "Traitement Sel Vert" },
    { letter: "5", short: "In 5", long: "Entree 5" },
    { letter: "6", short: "In 6", long: "Entree 6" },
    { letter: "7", short: "In 7", long: "Entree 7" },
    { letter: "8", short: "In 8", long: "Entree 8" },
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
