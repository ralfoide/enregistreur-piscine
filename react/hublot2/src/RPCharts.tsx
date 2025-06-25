import type {ReactElement} from "react";
import {Card, Container} from "react-bootstrap";
import {type ChartData, type ChartPoint, RPChart} from "./RPChart.tsx";
import type {DataList} from "./RPEventLog.tsx";
import RPConstants from "./RPConstants.ts";

function _insertChart(chartData: ChartData, key: number) {
    return <RPChart className="RPChart" key={`chart-${key}`} data={ chartData } width={700} height={200} />
}

function _insertCharts(chartsData: ChartData[]) {
    return chartsData.map( (chartData, k) => _insertChart(chartData, k) )
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
    const nowHour = d.valueOf() / 1000 / 3600
    // function to compute hour difference from now to input second timestamps
    const hourDelta = (tsec: number) => nowHour - (tsec / 3600)

    const hourNow = (d.getHours() * 3600 + d.getMinutes() * 60 + d.getSeconds()) / 3600

    // Copy & sort the input event array to have the most recent event first
    const rev_events = [...input.events].sort( (a, b) => b.epoch - a.epoch )

    const output : ChartData[] = []
    RPConstants.InputNames.forEach( (v, k) => {
        const ci = v.chart
        if (output[ci] === undefined) { output.push( { hourNow: hourNow, curves: [] } ) }
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
            const x = hourDelta(ev.epoch)
            const y = (ev.state & mask) === 0 ? 0 : 1
            if (last === undefined) {
                output[ci].curves[cp].points.push( { x: x, y: y } )
            } else if (y !== last.y) {
                output[ci].curves[cp].points.push( { x: last.x, y: last.y } )
                output[ci].curves[cp].points.push( { x: last.x, y: y } )
            }
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
