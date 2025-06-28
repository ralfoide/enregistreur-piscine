import type {ReactElement} from "react";
import Navbar from "react-bootstrap/Navbar";
import {RPGitInfo} from "./RPGitInfo.ts";
import RPConstants from "./RPConstants.ts";

export function RPFooter() : ReactElement {
    return (
        //  size="sm"
        <Navbar bg="dark" variant="dark" className="justify-content-end">
            <Navbar.Text>
                { RPConstants.dev ? "(LOCAL DEBUG) " : "" }
                { RPGitInfo }
            </Navbar.Text>
        </Navbar>
    )
}
