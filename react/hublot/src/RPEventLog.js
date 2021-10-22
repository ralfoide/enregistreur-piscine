import "./RPApp.css"
import RPConstants from "./RPConstants"
import React from "react"
import Container from "react-bootstrap/Container"
import { useEffect, useState } from "react"
import axios from "axios"
import Moment from "react-moment"

function _intToBits(val) {
    return Array.from( { length: RPConstants.NumOut }, (v, k) => ( val & (1<<k)) )
}

function _insertInput(val, pin, key) {
    const st = val === 0 ? "off" : "on"
    return (
        <span key={`evt-s-${pin}-${key}`}>
        <span key={`evt-${pin}-${key}`} className={`RPEvent ${st}`} > &nbsp; {pin} &nbsp; </span>
        &nbsp;
        </span>
        )
}

function _insertEvent(ev) {
    // ev = { state: val, epoch }
    return ( <p key={`evt-p-${ev.epoch}`}>
        { _intToBits(ev.state).map( (val, pin) => _insertInput(val, pin, ev.epoch) ) }
        <Moment unix local locale="fr" format="LL, LTS">{ ev.epoch }</Moment>
        </p> )
}

const RPEventLog = () => {
    const [ _data, _setData ] = useState( { events: [], epoch: 0 } )
    const [ _status, _setStatus ] = useState( "Chargement en cours" )

    useEffect( () => {
        _fetchData()
        const interval = setInterval( () => _fetchData(), RPConstants.EventsRefreshMs )
        return () => clearInterval(interval)
      }, [])
    
    async function _fetchData() {
        const url = RPConstants.eventsGetUrl()
        RPConstants.log("@@ fetch " + url)
        axios.get(url)
            .then( (response) => {
                // RPConstants.log("@@ axios response: " + JSON.stringify(response))
                _setStatus(undefined)
                _setData(response.data)
            })
            .catch( (error) => {
                _setStatus("Erreur de chargement")
                RPConstants.log("@@ axios error: " + JSON.stringify(error))
            })
    }

    return (_status !== undefined) ? (
        <div>
            <Container>
                <h1> Historique </h1>
            </Container>
            <Container>
                { _status }
            </Container>
        </div>
    ) : (
        <div>
            <Container>
                <h1> Historique </h1>
            </Container>
            <Container>
                { _data.events.map( ev => _insertEvent(ev) ) }
                Mis a jour: <Moment local unix locale="fr" format="LL, LTS">{ _data.epoch }</Moment>
            </Container>
        </div>
  )
}

export default RPEventLog
