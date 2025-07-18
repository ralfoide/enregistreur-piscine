import type {ReactElement} from "react";
import {Card, Container} from "react-bootstrap";
import RPCommon from "./RPCommon.tsx";
import {DateTime} from "luxon";

export interface DataEvent {
    // rpiscine_serv.py updatePin() line 196:
    state: number;
    epoch: number;
    // extra local fields (not from server):
    delta: string;
}

export interface DataList {
    // rpisicine_serv.py line 338:
    events: DataEvent[];
    epoch: number;
    // extra local fields (not from server):
    first_epoch: number;
    last_epoch: number;
}

interface EventLogProps {
    data: DataList,
}


function _insertEvent(ev: DataEvent, index: number) {
    const dateTime = DateTime.fromSeconds(ev.epoch, { locale: "fr" });
    const dateString = dateTime.toLocaleString({
        year:       "numeric",
        month:      "long",
        day:        "numeric",
        hour:       "2-digit",
        hourCycle:  "h23",      // h23 shows 00:00, h24 shows 24:00 for midnight.
        minute:     "2-digit",
        second:     "2-digit",
        // separator:  ", ",    // not in options??
    });
    const relativeToNow = dateTime.toRelative();

    return ( <tr key={`evt-1-${ev.epoch}-${index}`} className="RPEvent-Line">
        { RPCommon.intToBits(ev.state).map(
            (val, pin) =>
                RPCommon.insertInput("evt", "RPEvent", val, pin, ev.epoch) ) }
        <td key={`evt-2-${ev.epoch}`}>
            { dateString }
            , { ' ' }
            <span title={dateString}>{ relativeToNow }</span>
        </td><td key={`evt-4-${ev.epoch}`}>
        &nbsp;{ ev.delta }
    </td>
    </tr> )
}

export function RPEventLog ( props: EventLogProps ) : ReactElement {
    return (
        <Container>
            <Card>
                <Card.Body className="bg-white" >
                    <Card.Title>Evénements</Card.Title>
                    <Card.Text as="div">
                        <table><thead><tr>
                            { RPCommon.insertHeader("evt") }
                        </tr></thead>
                            <tbody>
                            { props.data.events.slice(0).reverse().map( (ev, index) => _insertEvent(ev, index) ) }
                            <tr>
                            </tr></tbody></table>
                    </Card.Text>
                </Card.Body>
            </Card>
        </Container>
    )
}
