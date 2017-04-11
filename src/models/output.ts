import { LOG_LEVELS } from "../constants";
import Log from "./log";

export interface OutputProperties {
    readonly message: string;
    readonly level: LOG_LEVELS;
    readonly timestamp: Date;
    readonly transaction_id: string;
    readonly id: string;
    readonly stack?: string;
}

export default class Output implements OutputProperties {

    readonly message: string;

    readonly stack: string;

    readonly level: LOG_LEVELS;

    private levelColors: { readonly [level: string]: string } = {
        "ERROR": "#e53935",
        "WARN": "orange",
        "INFO": "yellow",
        "DEBUG": "rgb(166, 226, 46)"
    };

    get levelColor(): string {
        return this.levelColors[this.level];
    }

    readonly timestamp: Date;

    readonly transaction_id: string;

    readonly id: string;

    constructor(props: OutputProperties) {
        this.message = props.message;
        this.level = props.level;
        this.timestamp = props.timestamp;
        this.transaction_id = props.transaction_id;
        this.id = props.id;
        this.stack = props.stack;
    }

    static fromLog(log: Log): Output {
        return new Output({
            message: log.payload,
            stack: log.stack,
            level: log.log_type,
            timestamp: log.timestamp,
            transaction_id: log.transaction_id,
            id: log.id
        });
    }
}

