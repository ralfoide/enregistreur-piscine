import "./RPApp.css"
import RPConstants from "./RPConstants"
import React from "react"
import Card from "react-bootstrap/Card"
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
        <span key={`inp-s-${pin}`}>
        <span key={`inp-${pin}`} className={`RPInput ${st}`} > &nbsp; {pin} &nbsp; </span>
        &nbsp;
        </span>
        )
}

const RPInputs = () => {
    const [ _data, _setData ] = useState( { state: 0, epoch: 0 } )
    const [ _status, _setStatus ] = useState( "Chargement en cours" )

    useEffect( () => {
        _fetchData()
        const interval = setInterval( () => _fetchData(), RPConstants.CurrentRefrehsMs )
        return () => clearInterval(interval)
      }, [])
    
    async function _fetchData() {
        const url = RPConstants.currentGetUrl()
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
        <Container>
            <Card>
                <Card.Body>
                    <Card.Title>Etat courant</Card.Title>
                    <Card.Text>
                        { _status }
                    </Card.Text>
                </Card.Body>
            </Card>
        </Container>
    ) : (
        <Container>
            <Card>
                <Card.Body>
                    <Card.Title>Etat courant</Card.Title>
                    <Card.Text>
                        { _intToBits(_data.state).map( (val, pin) => _insertInput(val, pin) ) }
                        <Moment local unix locale="fr" format="LL, LTS">{ _data.epoch }</Moment>
                    </Card.Text>
                </Card.Body>
            </Card>
        </Container>
  )
}

export default RPInputs
