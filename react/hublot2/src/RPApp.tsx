import "./RPApp.css"
import {RPMachine} from "./RPMachine.tsx";
import {RPFooter} from "./RPFooter.tsx";
import RPInputs from "./RPInputs.tsx";
import RPEvents from "./RPEvents.tsx";

function RPApp() {
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
