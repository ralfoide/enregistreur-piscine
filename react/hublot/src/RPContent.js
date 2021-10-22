import "./RPApp.css"
import RPConstants from "./RPConstants"
import React from "react"
import Container from "react-bootstrap/Container"
import { useEffect, useState } from "react"
import axios from "axios"
import Moment from "react-moment"

function _intToBits(val) {
    const v = Array.from( { length: RPConstants.NumOut }, (v, k) => ( val & (1<<k)) )
    RPConstants.log("bits: " + JSON.stringify(v))
    return v
}

function _insertInput(val, pin) {
    const st = val === 0 ? "off" : "on"
    return (
        <span>
        <span key={`inp-${pin}`} className={`RPInput ${st}`} > &nbsp; {pin} &nbsp; </span>
        &nbsp;
        </span>
        )
}

const RPContent = () => {
    const [ _data, _setData ] = useState( { state: 0, epoch: 0 } )
    const [ _status, _setStatus ] = useState( "Chargement en cours" )

    useEffect( () => {
        const interval = setInterval( () => _fetchData(), 1000 )
        return () => clearInterval(interval)
      }, [])
    
    async function _fetchData() {
        axios.get(RPConstants.UrlCurrent)
            .then( (response) => {
                RPConstants.log("@@ axios response: " + JSON.stringify(response))
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
                <h1> Etat entrees </h1>
            </Container>
            <Container>
                { _status }
            </Container>
        </div>
    ) : (
        <div>
            <Container>
                <h1> Etat entrees </h1>
            </Container>
            <Container>
                {
                    _intToBits(_data.state).map( (val, pin) => _insertInput(val, pin) )
                }
                <br/>
                Mis a jour: <Moment withTitle titleFormat="lll">{ _data.epoch * 1000 }</Moment>
            </Container>
        </div>
  )
}

export default RPContent
