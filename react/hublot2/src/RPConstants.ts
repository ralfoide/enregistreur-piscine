let RPVerbose = false

export interface InputData {
    // Letter representing the input in the bit lists
    letter: string;
    // Short name
    short: string;
    // Long name
    long: string;
    // Chart index (0..1)
    chart: number;
    // Chart position index (0..n)
    chart_pos: number;
    // #RGB color
    color: string;
}

const _InputNames : InputData[] = [  // must match NumOut below.
    { letter: "P", short: "Pompe", long: "M/A Pompe",             chart: 0, chart_pos: 0, color: "#1155cc" },
    { letter: "C", short: "Chauf", long: "M/A Chauffage",         chart: 0, chart_pos: 1, color: "#ff9900" },
    { letter: "R", short: "Sel Rg", long: "Traitement Sel Rouge", chart: 0, chart_pos: 2, color: "#ff0000" },
    { letter: "V", short: "Sel Vt", long: "Traitement Sel Vert",  chart: 0, chart_pos: 3, color: "#009f00" },
    // Unused for now... we have nothing on inputs 5 to 8.
    // { letter: "5", short: "In 5", long: "Entrée 5",               chart: 1, chart_pos: 0, color: "#c27ba0" },
    // { letter: "6", short: "In 6", long: "Entrée 6",               chart: 1, chart_pos: 1, color: "#a64d79" },
    // { letter: "7", short: "In 7", long: "Entrée 7",               chart: 1, chart_pos: 2, color: "#9900ff" },
    // { letter: "8", short: "In 8", long: "Entrée 8",               chart: 1, chart_pos: 3, color: "#ff00ff" },
]

function _init() {
    // Debugging:
    //RPVerbose = isLocalhost;
    RPVerbose = true
    _log("@@ Verbose: " + RPVerbose)
}

function _log(param: string) {
    if (RPVerbose) console.log("@@ " + param)
}

function _isDev() {
    // This is the "npm start" dev environment if current port is 3000.
    return window.location.port === "3000"
}

function _isPreview() {
    // This is the "npm run preview" dev environment if current port is 8070.
    return window.location.port === "8070"
}

function _getServBaseUrl() {
    const port = _isDev() ? ":8080" :
        _isPreview() ? ":80" :
        (parseInt(window.location.port, 10) === 80 ? "" : (":" + window.location.port))
    return window.location.protocol
        + "//" + window.location.hostname
        + port
        + (_isDev() ? "" : "/serv")
}

const RPConstants = {
    init: _init,
    log: _log,
    dev: _isDev(),
    NumOut: _InputNames.length,
    fetchCurrentUrl:    () => _getServBaseUrl() + "/current",
    fetchEventsUrl:     () => _getServBaseUrl() + "/events",
    fetchIpUrl:         () => _getServBaseUrl() + "/ip",
    downloadUrl:        () => _getServBaseUrl() + "/download",
    CurrentRefreshMs: 5000,
    EventsRefreshMs: 30000,
    InputNames: _InputNames,
}

export default RPConstants
