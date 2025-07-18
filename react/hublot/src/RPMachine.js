import "./RPApp.css"
import RPConstants from "./RPConstants"
import React from "react"
import Navbar from "react-bootstrap/Navbar"
import Button from "react-bootstrap/Button"
import { useEffect, useState } from "react"
import axios from "axios"


function _action(title, getUrlMethod) {
    const msg = "Etes-vous sûr de vouloir " + title + " ? Il est impossible d'annuler cette action."
    if (window.confirm(msg)) {
        axios.get(getUrlMethod())
        .then( (response) => {
            let msg = response.data
            if (msg !== undefined) { msg = msg.status }
            if (msg === undefined) { msg = JSON.stringify(response) }
            window.alert("Resultat: " + msg)
        })
        .catch( (error) => {
            let msg = error.message
            if (msg === undefined) { msg = JSON.stringify(error) }
            window.alert("Erreur: " + JSON.stringify(msg))
        })
    }
}

function _prepareData(data) {
    let hostname = data.hostname
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

const RPMachine = () => {
    const [ _data, _setData ] = useState( { hostname: "N/A", ip: "N/A" } )
    const [ _status, _setStatus ] = useState( { text: "Chargement en cours", details: undefined } )

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
                    <Button 
                        size="sm" 
                        onClick={ () => _action("Redémarrer", RPConstants.rebootUrl) }
                        >Redémarrer</Button>
                    <span className="RPGap">{ ' ' }</span>
                    <Button 
                        size="sm" 
                        onClick={ () => _action("Eteindre", RPConstants.shutdownUrl) }
                        >Eteindre</Button>
                </Navbar.Text>
            </Navbar.Collapse>
        </Navbar>
  )
}

export default RPMachine
