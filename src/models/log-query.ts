import DateUtil from "../utils/date";

import Source from "./source";

export interface LogQueryProperties {
    startTime?: Date;
    endTime?: Date;
    source: Source;
}

export default class LogQuery implements LogQueryProperties {

    readonly source: Source;

    readonly startTime: Date;

    readonly endTime: Date;

    get queryString(): string {

        let queryString: string = "";

        queryString += "source=" + this.source.secretKey;

        queryString += "&start_time=" + this.startTime.toISOString();

        if (this.endTime) {
            queryString += "&end_time=" + this.endTime.toISOString();
        }

        return queryString;

    }

    constructor(props: LogQueryProperties) {
        this.source = props.source;
        this.startTime = props.startTime ? props.startTime : DateUtil.daysAgo(1);
        this.endTime = props.endTime;
    }
}