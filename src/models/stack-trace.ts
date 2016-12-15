import Log from "./log";
import StackTraceElement, { javaScriptStackTraceRegex } from "./stack-trace-element";

interface StackTraceProperties {
    timestamp: Date;
    raw: string;
    message: string;
    elements: StackTraceElement[];
}

export default class StackTrace implements StackTraceProperties {

    readonly timestamp: Date;

    readonly raw: string;

    readonly message: string;

    readonly elements: StackTraceElement[];

    get top(): StackTraceElement {
        return this.elements[0];
    }

    constructor(props: StackTraceProperties) {
        this.timestamp = props.timestamp;
        this.raw = props.raw;
        this.message = props.message;
        this.elements = props.elements;
    }

    static fromLog(log: Log): StackTrace {

        let stackTrace: StackTrace;

        if (log.stack) {

            let props = {
                timestamp: log.timestamp,
                raw: log.stack,
                message: log.payload,
                elements: new Array<StackTraceElement>()
            };

            // Split by new line.
            let lines = props.raw.split("\n");

            // Check to see if it is a JavaScript trace
            if (javaScriptStackTraceRegex.exec(props.raw)) {
                // If it is remove the first index of the array
                // because it is the same as the payload
                lines.splice(0, 1);
            }

            for (let line of lines) {
                if (line.length > 0) {
                    props.elements.push(StackTraceElement.fromString(line));
                }
            }

            stackTrace = new StackTrace(props);

        }

        return stackTrace;
    }
}