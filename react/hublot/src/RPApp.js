import "./RPApp.css"
import React from "react"
import RPInputs from "./RPInputs"
import RPEvents from "./RPEvents"
import RPConstants from "./RPConstants"
import RPMachine from "./RPMachine"
import RPFooter from "./RPFooter"
import Moment from "react-moment"
import "moment-timezone"    // required for default timezone support below

// Indicates we want to process everything with a fr locale format.
// Also our default timezone is FR, not the current browser one (we use epoch values with a tz)
Moment.globalLocale = "fr"
Moment.globalTimezone = "Europe/Paris"

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
