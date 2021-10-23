import RPConstants from "./RPConstants"
import React from "react"

function _intToBits(val) {
    return Array.from( { length: RPConstants.NumOut }, (v, k) => ( val & (1<<k)) )
}

function _insertInput(keyPrefix, cssClass, val, pin, key) {
    const st = val === 0 ? "off" : "on"
    const letter = RPConstants.InputNames[pin].letter
    const title = RPConstants.InputNames[pin].long
    return (
        <td key={`${keyPrefix}-d-${pin}-${key}`}>
            <span key={`${keyPrefix}-s-${pin}-${key}`}
                className={`${cssClass} ${st}`}
                title={`${title}`}>
            {letter}
            </span>
        </td>
        )
}

function _insertHeader(keyPrefix) {
    return Array.from( { length: RPConstants.NumOut }, (v, k) => {
            const title = RPConstants.InputNames[k].short
            return ( <td className="RPHeader" key={`${keyPrefix}-hd-${k}`}>{ title }</td> )} )
}

const RPCommon = {
    intToBits: _intToBits,
    insertInput: _insertInput,
    insertHeader: _insertHeader
}

export default RPCommon
