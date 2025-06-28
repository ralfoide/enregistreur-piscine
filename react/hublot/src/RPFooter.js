import "./RPApp.css"
import React from "react"
import Navbar from "react-bootstrap/Navbar"
import { RPGitInfo } from "./RPGitInfo"

const RPFooter = () => {
    return (
        <Navbar bg="dark" variant="dark" className="justify-content-end" size="sm">
            <Navbar.Text>
                { RPGitInfo }
            </Navbar.Text>
        </Navbar>
  )
}

export default RPFooter
