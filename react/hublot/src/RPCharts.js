import "./RPApp.css"
import RPConstants from "./RPConstants"
import React from "react"
import Card from "react-bootstrap/Card"
import Container from "react-bootstrap/Container"
import { useEffect, useState } from "react"
import axios from "axios"
import RPChart from "./RPChart"

function _insertChart(chartData, key) {
    // const data = {
    //     bgColor: 'rgba(255, 99, 132, 1)',
    //     data: [
    //         { x: 0, y: 0 },

    //         { x: 1, y: 0 },
    //         { x: 1, y: 1 },
    //         { x: 3, y: 1 },
    //         { x: 3, y: 0 },
    
    //         { x: 10, y: 0 },
    //         { x: 10.5, y: 1 },
    //         { x: 13, y: 1 },
    //         { x: 13.5, y: 0 },
    
    //         { x: 24, y: 0 },
    //     ]
    // }
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

    let output = []
    RPConstants.InputNames.forEach( (v, k) => {
        const ci = v.chart
        // if (ci > 0) return // DEBUG
        if (output[ci] === undefined) { output.push( { hourNow: hourNow, curves: [] } ) }
        const cp = v.chart_pos
        // if (cp > 0) return // DEBUG
        if (output[ci].curves[cp] === undefined) {
            output[ci].curves.push( {
                title: v.long,
                color: v.color,
                points: []
            } )
        }

        const mask = 1<<k
        input.events.sort( (a, b) => b.epoch - a.epoch )

        let last = -1
        input.events.forEach( ev => {
            const y = (ev.state & mask) === 0 ? 0 : 1
            if (y !== last) {
                const x = hourDelta(ev.epoch)
                output[ci].curves[cp].points.push( { x: x, y: last } )
                output[ci].curves[cp].points.push( { x: x, y: y } )
                last = y
            }
        })
    })

    // DEBUG RPConstants.log("@@ transformed: " + JSON.stringify(output))
    return output
}


const RPCharts = () => {
    const [ _data, _setData ] = useState( [] )
    const [ _status, _setStatus ] = useState( "Chargement en cours" )

    useEffect( () => {
        _fetchData()
        // const interval = setInterval( () => _fetchData(), RPConstants.CurrentRefrehsMs )
        // return () => clearInterval(interval)
      }, [])
    
    async function _fetchData() {
        const url = RPConstants.eventsGetUrl()
        RPConstants.log("@@ fetch " + url)
        axios.get(url)
            .then( (response) => {
                // RPConstants.log("@@ axios response: " + JSON.stringify(response))
                _setStatus(undefined)
                _setData(_transformData(response.data))
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
                    <Card.Title>Courbes</Card.Title>
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
                    <Card.Title>Courbes</Card.Title>
                    <Card.Text>
                        { _insertCharts(_data) }
                    </Card.Text>
                </Card.Body>
            </Card>
        </Container>
  )
}

export default RPCharts
