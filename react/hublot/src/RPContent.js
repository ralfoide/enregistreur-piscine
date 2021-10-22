//import RPiscineHost from "./RPConstants"
import React from "react"
import Container from "react-bootstrap/Container"
import Jumbotron from "react-bootstrap/Jumbotron"
import { useEffect, useState } from "react"
import axios from "axios"

const RPContent = () => {
    const [ _data, _setData ] = useState( [] )

    useEffect( () => {
        _fetchData()
      }, [])
    
    async function _fetchData() {
        _setData( { state: 0, epoch: 0 } )
        // var url = RPiscineHost + "/current"
        var url = "http://192.168.1.60:8080/current"
        console.log("@@ axios URL: " + url)
        axios.get(url)
            .then( (response) => {
                console.log("@@ axios response: " + JSON.stringify(response))
                _setData(response.data)
            })
            .catch( (error) => {
                console.log("@@ axios error: " + JSON.stringify(error))
            })
    }

    return (
        <div>
            <Jumbotron fluid>
                <Container>
                    <h1> R-Piscine </h1>
                </Container>
            </Jumbotron>
            <Container>
                Entrees: { _data.state } temps { _data.epoch }
            </Container>
        </div>
  )
}

export default RPContent
