import RPConstants from "./RPConstants.ts";
import type {ReactElement} from "react";

function _intToBits(val: number) : number[] {
    return Array.from(
        { length: RPConstants.NumOut },
        (_v, k) => ( val & (1<<k)) )
}

function _insertInput(keyPrefix: string, cssClass: string, val: number, pin: number, key: string)
    : ReactElement {
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

function _insertHeader(keyPrefix: string) : ReactElement[] {
    return Array.from(
        { length: RPConstants.NumOut },
        (_v, k) => {
        const title = RPConstants.InputNames[k].short
        return ( <td className="RPHeader" key={`${keyPrefix}-hd-${k}`}>{ title }</td> )} )
}

const RPCommon = {
    intToBits: _intToBits,
    insertInput: _insertInput,
    insertHeader: _insertHeader
}

export default RPCommon

