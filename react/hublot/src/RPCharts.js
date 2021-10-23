import "./RPApp.css"
import RPConstants from "./RPConstants"
import React from "react"
import Card from "react-bootstrap/Card"
import Container from "react-bootstrap/Container"
import { useEffect, useState } from "react"
import axios from "axios"
import { ScatterChart, Scatter, Line, XAxis, YAxis, CartesianGrid } from "recharts"

function _insertChart(key) {
    const data = [
        { x: 0, y: 0 },

        { x: 1, y: 0 },
        { x: 1, y: 1 },
        { x: 3, y: 1 },
        { x: 3, y: 0 },

        { x: 10, y: 0 },
        { x: 10.5, y: 1 },
        { x: 13, y: 1 },
        { x: 13.5, y: 0 },

        { x: 24, y: 0 },
    ]
    return ( 
        <ScatterChart
            key={ `chart-${key}` }
            width={ 600 }
            height={ 100 }
        >
            <CartesianGrid/>
            <XAxis type="number" dataKey="x" unit="h" domain={[0, 24]} tickCount={ 24 } allowDataOverflow="true" />
            <YAxis type="number" dataKey="y" domain={[-0.01, 1.01]} ticks={[0, 1]} />
            <Scatter name="Chauffage" data={ data } line={{ stroke: "red", strokeWidth: 2 }} fill="red" shape="diamond" />
        </ScatterChart>
    )
}

function _insertCharts() {
    return Array.from( { length: RPConstants.NumOut }, (v, k) => {
        const title = RPConstants.InputNames[k].long
        return ( <div>
            { title } <br/>
            { _insertChart(k) }
            </div>
        ) } )
}

const RPCharts = () => {
    const [ _data, _setData ] = useState( { state: 0, epoch: 0 } )
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
                        { _insertCharts() }
                    </Card.Text>
                </Card.Body>
            </Card>
        </Container>
  )
}

export default RPCharts
