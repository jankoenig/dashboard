import * as moment from "moment";

import { TimeSeriable } from "./time-series";

export interface SessionProperties {
    start?: TimeSeriable;

    end?: TimeSeriable;

    error?: string;

    url?: string;

    content?: string;

}

export default class Session implements SessionProperties {

    readonly start: TimeSeriable;

    readonly end: TimeSeriable;

    readonly content: string;

    /**
     * Get the session duration in seconds.
     *
     * @readonly
     * @type {number} Total length of the sesion in seconds.
     * @memberOf Session
     */
    get duration(): number {
        return moment(this.end.timestamp).diff(moment(this.start.timestamp), "seconds");

    }

    constructor(props: SessionProperties) {
        this.start = props.start;
        this.end = props.end;
        this.content = props.content;
    }
}