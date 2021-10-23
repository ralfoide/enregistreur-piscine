import "./RPApp.css"
import RPConstants from "./RPConstants"
import RPCommon from "./RPCommon"
import React from "react"
import Card from "react-bootstrap/Card"
import Container from "react-bootstrap/Container"
import { useEffect, useState } from "react"
import axios from "axios"
import Moment from "react-moment"

const RPInputs = () => {
    const [ _data, _setData ] = useState( { state: 0, epoch: 0 } )
    const [ _status, _setStatus ] = useState( "Chargement en cours" )

    useEffect( () => {
        _fetchData()
        const interval = setInterval( () => _fetchData(), RPConstants.CurrentRefrehsMs )
        return () => clearInterval(interval)
      }, [])
    
    async function _fetchData() {
        const url = RPConstants.currentGetUrl()
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
                    <Card.Title>Etat courant</Card.Title>
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
                    <Card.Title>Etat courant</Card.Title>
                    <Card.Text>
                        <table><thead><tr>
                        { RPCommon.insertHeader("inp") }
                        </tr></thead>
                        <tbody><tr>
                        { RPCommon.intToBits(_data.state).map( (val, pin) => 
                            RPCommon.insertInput("inp", "RPInput", val, pin) ) }
                        <td>
                        <Moment local unix locale="fr" format="LL, LTS">{ _data.epoch }</Moment>
                        </td>
                        </tr></tbody></table>
                    </Card.Text>
                </Card.Body>
            </Card>
        </Container>
  )
}

export default RPInputs
