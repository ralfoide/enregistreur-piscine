import "./RPApp.css"
import RPConstants from "./RPConstants"
import RPCharts from "./RPCharts"
import RPEventLog from "./RPEventLog"
import React from "react"
import Card from "react-bootstrap/Card"
import Container from "react-bootstrap/Container"
import Button from "react-bootstrap/Button"
import { useEffect, useState } from "react"
import axios from "axios"
import Moment from "react-moment"

function _prepareData(data) {
    data.events.sort((a, b) => a.epoch - b.epoch)
    data.first_epoch = ""
    data.last_epoch = ""
    if (data.events.length > 0) {
        data.first_epoch = data.events[0].epoch 
        data.last_epoch = data.events[data.events.length - 1].epoch
    }
    return data
}

const RPEvents = () => {
    const [ _data, _setData ] = useState( { events: [], epoch: 0 } )
    const [ _status, _setStatus ] = useState( { text: "Chargement en cours", details: undefined } )

    useEffect( () => {
        _fetchData()
        const interval = setInterval( () => _fetchData(), RPConstants.EventsRefreshMs )
        return () => clearInterval(interval)
      }, [])
    
    async function _fetchData() {
        const url = RPConstants.eventsGetUrl()
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
        <Container>
            <Card>
                <Card.Body>
                    <Card.Title>Données</Card.Title>
                    <Card.Text>
                        { _status.text }
                        <p/>
                        { _status.details === undefined ? "" : <pre>{_status.details}</pre>}
                    </Card.Text>
                </Card.Body>
            </Card>
        </Container>
    ) : (
        <Container>
            <Card>
                <Card.Body>
                    <Card.Title>Données</Card.Title>
                    <Card.Text>
                        <Button href={ RPConstants.downloadUrl() }>Télécharger</Button>
                        <br/>
                        Données:&nbsp;
                        <Moment local unix locale="fr" format="LL, LTS">{ _data.first_epoch }</Moment>
                        &nbsp;... jusqu'&agrave; ...&nbsp;
                        <Moment local unix locale="fr" format="LL, LTS">{ _data.last_epoch }</Moment>
                        <br/>
                        Affichage mis &agrave; jour: <Moment local unix locale="fr" format="LL, LTS">{ _data.epoch }</Moment>
                    </Card.Text>
                </Card.Body>
            </Card>
            <br/>
            <RPCharts data={ _data } />
            <br/>
            <RPEventLog data={ _data } />
        </Container>
  )
}

export default RPEvents
