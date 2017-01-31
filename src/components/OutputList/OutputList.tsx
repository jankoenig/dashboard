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
            paddingTop: "10px",
            paddingBottom: "10px",
            paddingLeft: "0px",
            margin: "0.5em 0px 0.5em 0.125em",
            backgroundColor: "rgb(39, 40, 34)",
            borderRadius: "10px"
        };
    }

    render() {

        // First combine all the outputs and stacktraces
        let combined: (StackTrace | Output)[] = [];
        combined = combined.concat(this.props.outputs);
        combined = combined.concat(this.props.stackTraces);

        // Now sort by timestamp
        combined.sort(function (a, b) {
            return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
        });

        let outputs: JSX.Element[] = [];

        for (let listItem of combined) {
            if (listItem instanceof Output) {
                outputs.push(
                    <OutputListItem key={listItem.id} output={listItem} />
                );
            } else if (listItem instanceof StackTrace) {
                outputs.push(
                    <StackTraceListItem key={listItem.id} stackTrace={listItem} />
                );
            }
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