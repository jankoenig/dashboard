
import { LOG_LEVELS } from "../constants";

export interface LogProperties {
    readonly payload: string | any;
    readonly stack?: string;
    readonly log_type: LOG_LEVELS;
    readonly source: string;
    readonly transaction_id: string;
    readonly timestamp: Date;
    readonly tags: string[];
    readonly id: string;
}

export class Log implements LogProperties {
    readonly payload: string | any;
    readonly stack: string;
    readonly log_type: LOG_LEVELS;
    readonly source: string;
    readonly transaction_id: string;
    readonly timestamp: Date;
    readonly tags: string[];
    readonly id: string;

    constructor(props: LogProperties) {
        this.payload = props.payload;
        this.stack = props.stack;
        this.log_type = props.log_type;
        this.source = props.source;
        this.transaction_id = props.transaction_id;
        this.timestamp = props.timestamp;
        this.tags = props.tags;
        this.id = props.id;
    }
}

export default Log;