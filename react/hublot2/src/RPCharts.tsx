import type {ReactElement} from "react";
import {Card, Container} from "react-bootstrap";
import {type ChartData, type ChartPoint, RPChart} from "./RPChart.tsx";
import type {DataEvent, DataList} from "./RPEventLog.tsx";
import RPConstants from "./RPConstants.ts";

function _insertChart(chartData: ChartData, key: number) {
    return <RPChart className="RPChart" key={`chart-${key}`} data={ chartData } width={700} height={200} />
}

function _insertCharts(chartsData: ChartData[]) {
    return chartsData.map( (chartData, k) => _insertChart(chartData, k) )
}

// Computes the delta in hours between the reference (now expressed in hours) and a given
// time in the past (expressed in seconds).
function _hourDelta(nowInHours: number, timeInSeconds: number) {
    return nowInHours - (timeInSeconds / 3600);
}

function _transformData(input: DataList): ChartData[] {
    // Input: event list [ { state: byte, epoch: timestamp }]
    // Output: drawing data: {
    //      hourNow: float representing hour for right-most edge,
    //      curves: list for each chart 0..1 [
    //      list for each curve 0..3 {
    //          title: string,
    //          color: rgb,
    //          points: list [ { x: 0..24, y: 0..1 }]
    //      }
    // ]
    // Data represents points in the last N hours (0 = right most side, most recent)

    // moment.valueOf() in ms converted to hours
    const d = new Date()
    const nowInHours = d.valueOf() / 1000 / 3600

    const hourNow = (d.getHours() * 3600 + d.getMinutes() * 60 + d.getSeconds()) / 3600

    // Copy & sort the input event array to have the most recent event first
    let rev_events : DataEvent[] = [];
    if (input.events !== undefined) {
        rev_events = [...input.events].sort((a, b) => b.epoch - a.epoch)
    }

    const output : ChartData[] = []
    RPConstants.InputNames.forEach( (v, k) => {
        const ci = v.chart
        if (output[ci] === undefined) {
            output.push( { hourNow: hourNow, curves: [] } )
        }
        const cp = v.chart_pos
        if (output[ci].curves[cp] === undefined) {
            output[ci].curves.push( {
                title: v.long,
                color: v.color,
                points: []
            } )
        }

        const mask = 1<<k

        let last : ChartPoint|undefined = undefined
        rev_events.forEach( ev => {
            // x is the delta in seconds from now towards the past.
            //   Note that rounding can make some events be in the future (negative x).
            // y is the curve height (0 or 1).
            // This foreach goes from x=0 (newest value) to x=>0 (oldest value),
            // that is we prepare the draw the curve from the right to the left.
            const x = _hourDelta(nowInHours, ev.epoch)
            const y = (ev.state & mask) === 0 ? 0 : 1
            if (last !== undefined && y !== last.y) {
                // An Y change means there has _been_ an edge.
                // Since we draw the curve from the right (newest) to the left (oldest),
                // we always set the edge on the last segments (the newest time) since
                // data points always represent the latest state change.
                output[ci].curves[cp].points.push( { x: last.x, y: last.y } )
                output[ci].curves[cp].points.push( { x: last.x, y: y } )
            }
            output[ci].curves[cp].points.push( { x: x, y: y } )
            last = { x: x, y: y }
        })
    })

    return output
}

interface ChartsProps {
    data: DataList,
}

export function RPCharts( props: ChartsProps ) : ReactElement {
    return (
        <Container>
            <Card>
                <Card.Body className="bg-white" >
                    <Card.Title>Courbes derni&egrave;res 24h</Card.Title>
                    <Card.Text as="div">
                        { _insertCharts(_transformData(props.data)) }
                    </Card.Text>
                </Card.Body>
            </Card>
        </Container>
    )
}
