import {type DataList, RPEventLog} from "./RPEventLog.tsx";
import RPConstants from "./RPConstants.ts";
import RPCommon from "./RPCommon.tsx";
import {type ReactElement, useEffect, useState} from "react";
import axios from "axios";
import {Button, Card, Container} from "react-bootstrap";

function _toHourMin(dec_hour: number) : string {
    const hour = Math.floor(dec_hour)
    let s = `${hour}h `
    const min = Math.floor((dec_hour - hour) * 60)
    if (min > 0) { s += min }
    return s
}

function _prepareData(data : DataList) : DataList {
    // Sort in-place with oldest event first. This makes processing more logical.
    data.events.sort((a, b) => a.epoch - b.epoch)
    data.first_epoch = 0
    data.last_epoch = 0

    const n = data.events.length
    if (n > 0) {
        const ev = data.events[0]
        data.first_epoch = ev.epoch
        data.last_epoch = data.events[n - 1].epoch

        const indices = Array.from(
            { length: RPConstants.NumOut },
            (v, k) => k )
        const last_m = indices.map( () => 0 )

        for (let i = 0; i < n; i++) {
            const ev = data.events[i]
            const s: string[] = []
            RPCommon.intToBits(ev.state).forEach( (v, k) => {
                if (v === 0) { // Arret
                    if (last_m[k] > 0) {
                        const delta = (ev.epoch - last_m[k]) / 3600
                        s.push(RPConstants.InputNames[k].short + ": " + _toHourMin(delta))
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

interface StatusItem {
    text: string;
    details: string | undefined;
}

export function RPEvents() : ReactElement {
    const [ _data, _setData ] = useState<DataList>( {
        events: [],
        epoch: 0,
        first_epoch: 0,
        last_epoch: 0,
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
                <Card.Body className="bg-white" >
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
                <Card.Body className="bg-white" >
                    <Card.Title>Données</Card.Title>
                    <Card.Text>
                        Données: { ' ' }
                        {/*<Moment local unix locale="fr" format="LL, LTS">{ _data.first_epoch }</Moment>*/}
                        { RPCommon.getFormattedDate(_data.first_epoch) }
                        { ' ' } ... jusqu'&agrave; ... { ' ' }
                        {/*<Moment local unix locale="fr" format="LL, LTS">{ _data.last_epoch }</Moment>*/}
                        { RPCommon.getFormattedDate(_data.last_epoch) }
                        { ' ' }
                        <Button size="sm" className="float-end" href={ RPConstants.downloadUrl() }>Télécharger</Button>
                        <br/>
                        Affichage mis &agrave; jour: { ' ' }
                        {/*<Moment local unix locale="fr" format="LL, LTS">{ _data.epoch }</Moment>*/}
                        { RPCommon.getFormattedDate(_data.epoch) }
                    </Card.Text>
                </Card.Body>
            </Card>
            <br/>
            {/* TBD <RPCharts data={ _data } />*/}
            <br/>
            <RPEventLog data={ _data } />
        </Container>
    )
}

export default RPEvents
