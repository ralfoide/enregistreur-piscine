import "./RPApp.css"
import React from "react"
import { HashRouter as Router, /*Switch,*/ Route } from "react-router-dom"
//import Container from "react-bootstrap/Container"
import RPInputs from "./RPInputs"
import RPEventLog from "./RPEventLog"
import RPHeader from "./RPHeader"
import RPConstants from "./RPConstants"
import RPCharts from "./RPCharts"

RPConstants.init()

const RPApp = () => {
    return (
        <div className="RPApp">
            <RPHeader/>
            <Router>
                <Route path="/" render={props => {
                    return (
                    <div>
                        <br/>
                        <RPInputs/>
                        <br/>
                        <RPCharts/>
                        <br/>
                        <RPEventLog/>
                    </div> ) } } />
            </Router>
        </div>
  )
}

export default RPApp
