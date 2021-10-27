import "./RPApp.css"
import React from "react"
import RPInputs from "./RPInputs"
import RPEvents from "./RPEvents"
import RPConstants from "./RPConstants"
import RPMachine from "./RPMachine"
import RPFooter from "./RPFooter"

RPConstants.init()

const RPApp = () => {
    return (
        <div className="RPApp">
            <RPMachine/>
            <br/>
            <RPInputs/>
            <br/>
            <RPEvents/>
            <br/>
            <RPFooter/>
        </div>
  )
}

export default RPApp
