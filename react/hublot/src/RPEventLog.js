import "./RPApp.css"
import RPCommon from "./RPCommon"
import React from "react"
import Card from "react-bootstrap/Card"
import Container from "react-bootstrap/Container"
import Moment from "react-moment"

function _insertEvent(ev) {
    // ev = { state: val, epoch }
    return ( <tr key={`evt-1-${ev.epoch}`} className="RPEvent-Line">
        { RPCommon.intToBits(ev.state).map( (val, pin) => RPCommon.insertInput("evt", "RPEvent", val, pin, ev.epoch) ) }
        <td key={`evt-2-${ev.epoch}`}>
        <Moment unix local locale="fr" format="L, LTS">{ ev.epoch }</Moment>
        , { ' ' }
        <Moment unix local locale="fr" withTitle titleFormat="LL, LTS" fromNow>{ ev.epoch }</Moment>.
        </td><td key={`evt-4-${ev.epoch}`}>
        &nbsp;{ ev.delta }
        </td>
        </tr> )
}

const RPEventLog = ( { data } ) => {
    return (
        <Container>
            <Card>
                <Card.Body>
                    <Card.Title>Evénements</Card.Title>
                    <Card.Text>
                        <table><thead><tr>
                        { RPCommon.insertHeader("evt") }
                        </tr></thead>
                        <tbody>
                        { data.events.slice(0).reverse().map( ev => _insertEvent(ev) ) }
                        <tr>
                        </tr></tbody></table>
                    </Card.Text>
                </Card.Body>
            </Card>
        </Container>
    )
}

export default RPEventLog
