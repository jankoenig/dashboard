import Log from "./log";
import StackTraceElement from "./stack-trace-element";

interface StackTraceProperties {
    raw: string;
    message: string;
    elements: StackTraceElement[];
}

export default class StackTrace implements StackTraceProperties {
    readonly raw: string;

    readonly message: string;

    readonly elements: StackTraceElement[];

    get top(): StackTraceElement {
        return this.elements[0];
    }

    constructor(props: StackTraceProperties) {
        this.raw = props.raw;
        this.message = props.message;
        this.elements = props.elements;
    }

    static fromLog(log: Log): StackTrace {

        let stackTrace: StackTrace;

        if (log.stack) {

            let props = {
                raw: log.stack,
                message: log.payload,
                elements: new Array<StackTraceElement>()
            };

            // Split by new line.
            let lines = log.stack.split("\n");

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