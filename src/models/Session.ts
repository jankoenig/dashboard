import * as moment from "moment";

import { TimeSeriable } from "./time-series";

export interface SessionProperties {

    launch?: TimeSeriable;

    start?: TimeSeriable;

    end?: TimeSeriable;

    error?: string;

    url?: string;

    content?: string;

    userId?: string;

    sessions?: Session[];

}

export default class Session implements SessionProperties {

    readonly start: TimeSeriable;

    readonly end: TimeSeriable;

    readonly content: string;

    readonly userId: string;

    readonly launch: TimeSeriable;

    readonly sessions: Session[];

    /**
     * Get the session duration in seconds.
     *
     * @readonly
     * @type {number} Total length of the sesion in seconds.
     * @memberOf Session
     */
    get duration(): number {

        let start = moment(this.start.timestamp);
        let end = moment(this.end.timestamp);

        if (this.sessions.length > 0) {
            end = moment(this.sessions[this.sessions.length - 1].end.timestamp);
        }

        return moment(end).diff(moment(start), "seconds");
    }

    constructor(props: SessionProperties) {
        this.start = props.start;
        this.end = props.end;
        this.content = props.content;
        this.userId = props.userId;
        this.launch = props.launch;
        this.sessions = props.sessions ? props.sessions : [];
    }
}