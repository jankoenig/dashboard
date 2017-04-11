import DateUtil from "../utils/date";

import Source from "./source";

export interface LogQueryProperties {
    readonly startTime?: Date | moment.Moment;
    readonly endTime?: Date| moment.Moment;
    readonly limit?: number;
    readonly source: Source;
}

export default class LogQuery implements LogQueryProperties {

    readonly source: Source;

    readonly startTime: Date | moment.Moment;

    readonly endTime: Date | moment.Moment;

    readonly limit: number;

    get queryString(): string {

        let queryString: string = "";

        queryString += "source=" + this.source.secretKey;

        if (this.startTime) {
            queryString += "&start_time=" + this.startTime.toISOString();
        }

        if (this.endTime) {
            queryString += "&end_time=" + this.endTime.toISOString();
        }

        if (this.limit) {
            queryString += "&limit=" + this.limit;
        }

        return queryString;

    }

    constructor(props: LogQueryProperties) {
        this.source = props.source;
        this.startTime = props.startTime ? props.startTime : DateUtil.daysAgo(1);
        this.endTime = props.endTime ? props.endTime : new Date();
        this.limit = props.limit;
    }
}