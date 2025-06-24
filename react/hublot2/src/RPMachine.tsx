import "./RPApp.css"
import RPConstants from "./RPConstants"
import {type ReactElement} from "react"
import Navbar from "react-bootstrap/Navbar"
import { useEffect, useState } from "react"
import axios from "axios"


interface DataItem {
    hostname: string;
    ip: string;
    ip_href: string;
    host_href: string;
}

interface StatusItem {
    text: string;
    details: string | undefined;
}

function _prepareData(data: DataItem) : DataItem {
    const hostname = data.hostname
    let link = "#"
    if (hostname !== undefined) {
        link = "http://" + hostname
        if (link.search("\\.") === -1) {
            link += ".local"
        }
    }
    data.host_href = link

    link = data.ip
    if (link !== undefined) {
        link = "http://" + link
    }
    data.ip_href = link

    return data
}


export function RPMachine() : ReactElement {
    const [ _data, _setData ] = useState<DataItem>( {
        hostname: "N/A",
        ip: "N/A",
        ip_href: "",
        host_href: "",
    } )
    const [ _status, _setStatus ] = useState<StatusItem | undefined>( {
        text: "Chargement en cours",
        details: undefined,
    } )

    useEffect( () => {
        _fetchData()
        const interval = setInterval( () => _fetchData(), RPConstants.EventsRefreshMs )
        return () => clearInterval(interval)
    }, [])

    async function _fetchData() {
        const url = RPConstants.fetchIpUrl()
        // DEBUG RPConstants.log("fetch " + url)
        axios.get(url)
            .then( (response) => {
                // RPConstants.log("@@ axios response: " + JSON.stringify(response))
                _setStatus(undefined)
                _setData(_prepareData(response.data))
            })
            .catch( (error) => {
                _setStatus( { text: "Erreur de chargement: " + error.message, details: error.stack } )
                RPConstants.log("@@ axios error: " + JSON.stringify(error))
            })
    }

    return (_status !== undefined) ? (
        <Navbar bg="dark" variant="dark">
            <Navbar.Brand href="/">
                R-Piscine
            </Navbar.Brand>
            {/* <Navbar.Collapse className="justify-content-end">
                <Navbar.Text>
                    User Name
                </Navbar.Text>
            </Navbar.Collapse> */}
        </Navbar>
    ) : (
        <Navbar bg="dark" variant="dark">
            <Navbar.Brand href={ _data.host_href }>
                R-Piscine
            </Navbar.Brand>
            <Navbar.Text>
            </Navbar.Text>
            <Navbar.Collapse className="justify-content-end">
                <Navbar.Text>
                    Addresse IP: <a href={ _data.ip_href }>{ _data.ip }</a>
                    <span className="RPGap">{ ' ' }</span>
                </Navbar.Text>
            </Navbar.Collapse>
        </Navbar>
    )
}
