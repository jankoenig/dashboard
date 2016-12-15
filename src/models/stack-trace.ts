import Log from "./log";
import StackTraceElement, { javaScriptStackTraceRegex } from "./stack-trace-element";

import String from "../utils/string";

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

            // Clean the stack a little by removing surrounding quotes, if they exist
            let cleanStack = props.raw;
            if (cleanStack.charAt(0) === '"' && cleanStack.charAt(cleanStack.length - 2) === '"') {
                cleanStack = String.setCharAt(cleanStack, 0, "");
                cleanStack = String.setCharAt(cleanStack, cleanStack.length - 2, "");
            }

            // Split by new line.
            let lines = cleanStack.split("\n");

            // Check to see if it is a JavaScript trace
            if (javaScriptStackTraceRegex.exec(props.raw)) {
                // It is a JavaScript stack trace,
                // use the first element as the message
                props.message = lines[0];
                // then remove it
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