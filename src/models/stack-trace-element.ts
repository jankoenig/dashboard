
export const javaStackTraceElementRegex = /^(\S*.?){1}\(\w*.java:\d*\)$/;
export const javaStackTraceRegex = /((\S*.?){1}\(\w*.java:\d*\)\n)+/;
const javaLineNumberRegex = /:(\d*)/;
const javaFileNameRegex = /\((\D*):\d*\)/;

export const javaScriptStackTraceElementRegex =  / {4}at .*:\d*:\d*\)?\n/;
export const javaScriptStackTraceRegex = new RegExp(".*\n(" + javaScriptStackTraceElementRegex.source + ")+");
const javaScriptLineNumberRegex = /:(\d*):\d*/;
const javaScriptFileNameRegex = /(.+\/|\()(.+\.js)/;

interface StackTraceElementProperties {
    raw: string;
    line: number;
    file: string;
    class?: string;
    method?: string;
}

export default class StackTraceElement implements StackTraceElementProperties {
    readonly raw: string;

    readonly line: number;

    readonly file: string;

    readonly class?: string;

    readonly method?: string;

    constructor(props: StackTraceElementProperties) {
        this.raw = props.raw;
        this.line = props.line;
        this.file = props.file;
        this.class = props.class;
        this.method = props.method;
    }

    static fromJavaStackTrace(element: string): StackTraceElement {
        // Default values
        let props: StackTraceElementProperties = {
            raw: element,
            line: 0,
            file: ""
        };

        let lines = javaLineNumberRegex.exec(element);

        if (lines) {
            props.line = parseInt(lines[1]);
        }

        let files = javaFileNameRegex.exec(element);

        if (files) {
            props.file = files[1];
        }

        // For class and method, we need to split the string
        // first split it at the parenthesis
        let packageString = element.split("(")[0];
        // then by periods
        let packageParts = packageString.split(".");

        if (packageParts.length > 2) {
            props.class = packageParts[packageParts.length - 2];
            props.method = packageParts[packageParts.length - 1];
        }

        return new StackTraceElement(props);
    }

    static fromJavaScriptStackTrace(element: string): StackTraceElement {

        // Default values
        let props: StackTraceElementProperties = {
            raw: element,
            line: 0,
            file: ""
        };

        let linesCapture = javaScriptLineNumberRegex.exec(element);
        if (linesCapture) {
            props.line = parseInt(linesCapture[1]);
        }

        let fileNameCapture = javaScriptFileNameRegex.exec(element);
        if (fileNameCapture) {
            props.file = fileNameCapture[2];
        }

        return new StackTraceElement(props);
    }

    static fromString(element: string): StackTraceElement {

        // first, try to figure out if it is Java or javaScriptLineNumberRegex
        if (javaStackTraceElementRegex.exec(element)) {
            return StackTraceElement.fromJavaStackTrace(element);
        } else {
            return StackTraceElement.fromJavaScriptStackTrace(element);
        }
    }
}