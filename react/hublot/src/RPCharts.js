import "./RPApp.css"
import RPConstants from "./RPConstants"
import React from "react"
import Card from "react-bootstrap/Card"
import Container from "react-bootstrap/Container"
import RPChart from "./RPChart"

function _insertChart(chartData, key) {
    return <RPChart className="RPChart" key={`chart-${key}`} data={chartData} width={700} height={200} />
}

function _insertCharts(chartsData) {
    return chartsData.map( (chartData, k) => _insertChart(chartData, k) )
}

function _transformData(input) {
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
    const hourDelta = tsec => nowHour - (tsec / 3600)

    const hourNow = (d.getHours() * 3600 + d.getMinutes() * 60 + d.getSeconds()) / 3600

    // Copy & sort the input event array to have the most recent event first
    const rev_events = [...input.events].sort( (a, b) => b.epoch - a.epoch )

    let output = []
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

        let last = undefined
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


const RPCharts = ( { data } ) => {
    return (
        <Container>
            <Card>
                <Card.Body>
                    <Card.Title>Courbes derni&egrave;res 24h</Card.Title>
                    <Card.Text>
                        { _insertCharts(_transformData(data)) }
                    </Card.Text>
                </Card.Body>
            </Card>
        </Container>
    )
}

export default RPCharts
