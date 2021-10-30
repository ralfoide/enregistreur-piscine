import "./RPApp.css"
import RPCommon from "./RPCommon"
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
    // Sort in-place with oldest event first. This makes processing more logical.
    data.events.sort((a, b) => a.epoch - b.epoch)
    data.first_epoch = ""
    data.last_epoch = ""

    const n = data.events.length
    if (n > 0) {
        let ev = data.events[0]
        data.first_epoch = ev.epoch 
        data.last_epoch = data.events[n - 1].epoch

        let indices = Array.from( { length: RPConstants.NumOut }, (v, k) => k )
        let last_m = indices.map( () => 0 )

        const fn = new Intl.NumberFormat("fr-FR", {maximumFractionDigits: 2})

        for (let i = 0; i < n; i++) {
            let ev = data.events[i]
            let s = []
            RPCommon.intToBits(ev.state).forEach( (v, k) => {
                if (v === 0) { // Arret
                    if (last_m[k] > 0) {
                        const delta = (ev.epoch - last_m[k]) / 3600
                        s.push(RPConstants.InputNames[k].short + ": " + fn.format(delta) + " h")
                        last_m[k] = 0
                    }
                } else {  // Marche
                    if (last_m[k] <= 0) {
                        last_m[k] = ev.epoch
                    }
                }
            })
            ev.delta = s.join(", ")
        }
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
        const url = RPConstants.fetchEventsUrl()
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
                        Données: { ' ' }
                        <Moment local unix locale="fr" format="LL, LTS">{ _data.first_epoch }</Moment>
                        { ' ' } ... jusqu'&agrave; ... { ' ' }
                        <Moment local unix locale="fr" format="LL, LTS">{ _data.last_epoch }</Moment>
                        { ' ' }
                        <Button size="sm" className="float-end" href={ RPConstants.downloadUrl() }>Télécharger</Button>
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
