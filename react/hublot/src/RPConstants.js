let RPVerbose = false

const _InputNames = [  // must match NumOut below.
    { letter: "P", short: "Pompe", long: "M/A Pompe",             chart: 0, chart_pos: 0, color: "#1155cc" },
    { letter: "C", short: "Chauf", long: "M/A Chauffage",         chart: 0, chart_pos: 1, color: "#ff9900" },
    { letter: "R", short: "Sel Rg", long: "Traitement Sel Rouge", chart: 0, chart_pos: 2, color: "#ff0000" },
    { letter: "V", short: "Sel Vt", long: "Traitement Sel Vert",  chart: 0, chart_pos: 3, color: "#00ff00" },
    { letter: "5", short: "In 5", long: "Entrée 5",               chart: 1, chart_pos: 0, color: "#c27ba0" },
    { letter: "6", short: "In 6", long: "Entrée 6",               chart: 1, chart_pos: 1, color: "#a64d79" },
    { letter: "7", short: "In 7", long: "Entrée 7",               chart: 1, chart_pos: 2, color: "#9900ff" },
    { letter: "8", short: "In 8", long: "Entrée 8",               chart: 1, chart_pos: 3, color: "#ff00ff" },
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
