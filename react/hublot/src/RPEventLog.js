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

function _insertInput(val, pin) {
    const st = val === 0 ? "off" : "on"
    return (
        <span>
        <span key={`inp-${pin}`} className={`RPEvent ${st}`} > &nbsp; {pin} &nbsp; </span>
        &nbsp;
        </span>
        )
}

function _insertEvent(ev) {
    // ev = { state: val, epoch }
    return ( <p>
        { _intToBits(ev.state).map( (val, pin) => _insertInput(val, pin) ) }
        <Moment withTitle titleFormat="lll">{ ev.epoch * 1000 }</Moment>
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
        axios.get(RPConstants.EventsGetUrl)
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
                <br/>
                Mis a jour: <Moment withTitle titleFormat="lll">{ _data.epoch * 1000 }</Moment>
            </Container>
        </div>
  )
}

export default RPEventLog
