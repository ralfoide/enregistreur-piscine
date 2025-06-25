import {useState, type ReactElement, useEffect} from "react";
import RPConstants from "./RPConstants";
import axios from "axios";
import {Card, Container} from "react-bootstrap";
import RPCommon from "./RPCommon.tsx";

interface DataItem {
    state: number;
    epoch: number;
}

interface StatusItem {
    text: string;
    details: string | undefined;
}

export function RPInputs() : ReactElement {
    const [ _data, _setData ] = useState<DataItem | undefined>( {
        state: 0,
        epoch: 0,
    } )
    const [ _status, _setStatus ] = useState<StatusItem | undefined>( {
        text: "Chargement en cours",
        details: undefined,
    })

    useEffect( () => {
        _fetchData()
        const interval = setInterval( () => _fetchData(), RPConstants.CurrentRefreshMs )
        return () => clearInterval(interval)
    }, [])

    async function _fetchData() {
        const url = RPConstants.fetchCurrentUrl()
        // DEBUG RPConstants.log("fetch " + url)
        axios.get(url)
            .then( (response) => {
                // RPConstants.log("@@ axios response: " + JSON.stringify(response))
                _setStatus(undefined)
                _setData(response.data)
            })
            .catch( (error) => {
                _setStatus( { text: "Erreur de chargement: " + error.message, details: error.stack } )
                RPConstants.log("@@ axios error: " + JSON.stringify(error))
            })
    }

    if (_status !== undefined) {
        return (
            <Container>
                <Card>
                    <Card.Body className="bg-white">
                        <Card.Title>Etat courant</Card.Title>
                        <Card.Text as="div">
                            { _status.text }
                            <p/>
                            { _status.details === undefined ? "" : <pre>{_status.details}</pre>}
                        </Card.Text>
                    </Card.Body>
                </Card>
            </Container>
        )
    } else if (_data === undefined) {
        // This case should never happen.
        return (
            <Container>
                <Card>
                    <Card.Body className="bg-white">
                        <Card.Title>Erreur</Card.Title>
                        <Card.Text as="div">
                            Erreur, donn&eacute;es manquantes.
                        </Card.Text>
                    </Card.Body>
                </Card>
            </Container>
        )
    } else {
        return (
            <Container>
                <Card>
                    <Card.Body className="bg-white">
                        <Card.Title>Etat courant</Card.Title>
                        <Card.Text as="div">
                            <table>
                                <thead>
                                <tr>
                                    {RPCommon.insertHeader("inp")}
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    { RPCommon.intToBits(_data.state).map((val, pin) =>
                                        RPCommon.insertInput("inp", "RPInput", val, pin, ""))
                                    }
                                    <td>
                                        { RPCommon.getFormattedDate(_data.epoch) }
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </Card.Text>
                    </Card.Body>
                </Card>
            </Container>
        )
    }
}

export default RPInputs
