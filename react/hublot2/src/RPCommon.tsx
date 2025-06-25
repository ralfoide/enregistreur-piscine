import RPConstants from "./RPConstants.ts";
import type {ReactElement} from "react";
import {DateTime} from "luxon";

function _intToBits(val: number) : number[] {
    return Array.from(
        { length: RPConstants.NumOut },
        (_v, k) => ( val & (1<<k)) )
}

function _insertInput(keyPrefix: string, cssClass: string, val: number, pin: number, key: string|number)
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

function _getFormattedDate(epoch: number) : string{
    // Performs the equivalent of:
    //   <Moment local unix locale="fr" format="LL, LTS">{ _data.epoch }</Moment>
    // using the Luxon library.

    if (epoch === undefined) {
        return "Inconnu."
    }

    const dateTime = DateTime.fromSeconds(epoch, { locale: "fr" });

    // Moment's LL is equivalent to Luxon's DateTime.DATE_FULL
    // Moment's LTS is equivalent to Luxon's DateTime.TIME_WITH_SECONDS
    // Combine both.

    return dateTime.toLocaleString({
        year:       "numeric",
        month:      "long",
        day:        "numeric",
        hour:       "2-digit",
        hourCycle:  "h23",      // h23 shows 00:00, h24 shows 24:00 for midnight.
        minute:     "2-digit",
        second:     "2-digit",
    });
}


const RPCommon = {
    intToBits: _intToBits,
    insertInput: _insertInput,
    insertHeader: _insertHeader,
    getFormattedDate: _getFormattedDate,
}

export default RPCommon

