import React from "react";
import ReactDOM from "react-dom";
import RPApp from "./RPApp";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "moment/locale/fr"

ReactDOM.render(
  <React.StrictMode>
    <RPApp />
  </React.StrictMode>,
  document.getElementById("root")
);

