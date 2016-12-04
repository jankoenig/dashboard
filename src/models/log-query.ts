import DateUtil from "../utils/date";

export interface LogQueryProperties {
    startDate?: Date;
    endDate?: Date;
    source: string;
}

export default class LogQuery implements LogQueryProperties {

    readonly source: string;

    readonly startDate: Date;

    readonly endDate: Date;

    constructor(props: LogQueryProperties) {
        this.source = props.source;
        this.startDate = props.startDate ? props.startDate : DateUtil.daysAgo(1);
        this.endDate = props.endDate;
    }
}