import "./RPApp.css"
import React from "react"
import { HashRouter as Router, Route } from "react-router-dom"
import RPInputs from "./RPInputs"
import RPEvents from "./RPEvents"
import RPHeader from "./RPHeader"
import RPConstants from "./RPConstants"
import RPMachine from "./RPMachine"

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
                        <RPMachine/>
                        <br/>
                        <RPInputs/>
                        <br/>
                        <RPEvents/>
                        <br/>
                    </div> ) } } />
            </Router>
        </div>
  )
}

export default RPApp
