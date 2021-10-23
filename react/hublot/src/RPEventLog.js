import "./RPApp.css"
import RPConstants from "./RPConstants"
import RPCommon from "./RPCommon"
import React from "react"
import Card from "react-bootstrap/Card"
import Container from "react-bootstrap/Container"
import { useEffect, useState } from "react"
import axios from "axios"
import Moment from "react-moment"

function _insertEvent(ev) {
    // ev = { state: val, epoch }
    return ( <tr key={`evt-p-${ev.epoch}`} className="RPEvent-Line">
        { RPCommon.intToBits(ev.state).map( (val, pin) => RPCommon.insertInput("evt", "RPEvent", val, pin, ev.epoch) ) }
        <td>
        <Moment unix local locale="fr" format="LL, LTS">{ ev.epoch }</Moment>
        </td><td>
        &nbsp;
        ( <Moment unix local locale="fr" withTitle titleFormat="LL, LTS" fromNow>{ ev.epoch }</Moment> )
        </td>
        </tr> )
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
        <Container>
            <Card>
                <Card.Body>
                    <Card.Title>Evénements</Card.Title>
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
                    <Card.Title>Evénements</Card.Title>
                    <Card.Text>
                        <table>
                        { _data.events.map( ev => _insertEvent(ev) ) }
                        <tr>
                        <td colSpan="9">
                        Mis a jour: <Moment local unix locale="fr" format="LL, LTS">{ _data.epoch }</Moment>
                        </td>
                        </tr>
                        </table>
                    </Card.Text>
                </Card.Body>
            </Card>
        </Container>
  )
}

export default RPEventLog
