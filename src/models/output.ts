import { LOG_LEVELS } from "../constants";
import Log from "./log";

export interface OutputProperties {
    message: string;
    level: LOG_LEVELS;
    timestamp: Date;
    transaction_id: string;
    id: string;
}

export default class Output implements OutputProperties {

    readonly message: string;

    readonly level: LOG_LEVELS;

    private levelColors: { [level: string]: string } = {
        "ERROR": "red",
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
    }

    static fromLog(log: Log): Output {
        return new Output({
            message: log.payload,
            level: log.log_type,
            timestamp: log.timestamp,
            transaction_id: log.transaction_id,
            id: log.id
        });
    }
}

