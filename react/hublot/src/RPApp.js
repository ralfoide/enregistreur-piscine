import "./RPApp.css"
import React from "react"
import { HashRouter as Router, /*Switch,*/ Route } from "react-router-dom"
//import Container from "react-bootstrap/Container"
import RPInputs from "./RPInputs"
import RPHeader from "./RPHeader"
import RPConstants from "./RPConstants"

RPConstants.init()

const RPApp = () => {
    return (
        <div className="RPApp">
            <RPHeader/>
            <Router>
                <Route path="/" render={props => {
                    return <RPInputs /> } } />
            </Router>
        </div>
  )
}

export default RPApp
