import "./RPApp.css"
import React from "react"
import Navbar from "react-bootstrap/Navbar"

const RPHeader = () => {
    return (
        <Navbar bg="dark" variant="dark">
            <Navbar.Brand href="/">
                R-Piscine
            </Navbar.Brand>
            {/* <Navbar.Collapse className="justify-content-end">
                <Navbar.Text>
                    User Name
                </Navbar.Text>
            </Navbar.Collapse> */}
        </Navbar>
  )
}

export default RPHeader
