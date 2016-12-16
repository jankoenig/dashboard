import * as React from "react";

import Output from "../../models/output";
import StackTrace from "../../models/stack-trace";
import OutputListItem from "./OutputListItem";
import StackTraceListItem from "./StackTraceListItem";

interface OutputListProps {
    outputs: Output[];
    stackTraces: StackTrace[];
}

export default class OutputList extends React.Component<OutputListProps, any> {
    constructor(props: OutputListProps) {
        super(props);
    }

    style() {
        return {
            listStyle: "none",
            userSelect: "none",
            paddingTop: "10px",
            paddingBottom: "10px",
            paddingLeft: "0px",
            margin: "0.5em 0px 0.5em 0.125em",
            backgroundColor: "rgb(39, 40, 34)",
            borderRadius: "10px"
        };
    }

    render() {

        let outputs: JSX.Element[] = [];

        for (let output of this.props.outputs) {
            outputs.push(
                <OutputListItem key={output.id} output={output} />
            );
        }

        for (let stackTrace of this.props.stackTraces) {
            outputs.push(
                <StackTraceListItem key={stackTrace.id} stackTrace={stackTrace} />
            );
        }

        let output: JSX.Element = (<span> No outputs </span>);

        if (outputs.length > 0) {
            output = (
                <ul style={this.style()}>
                    {outputs}
                </ul>
            );
        }

        return output;

    }
}