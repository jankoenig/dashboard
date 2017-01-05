import * as React from "react";

import Output from "../../models/output";

import StackTraceTextItem from "./StackTraceTextItem";

interface OutputListItemProps {
    output: Output;
}

export default class OutputListItem extends React.Component<OutputListItemProps, any> {

    style() {
        return {
            color: "white",
            margin: "5px"
        };
    }

    render() {
        return (
            <StackTraceTextItem
                id={this.props.output.id}
                timestamp={this.props.output.timestamp}
                level={this.props.output.level}
                levelColor={this.props.output.levelColor}
                message={this.props.output.message} />
        );
    }
}