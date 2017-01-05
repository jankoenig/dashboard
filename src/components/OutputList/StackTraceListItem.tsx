import * as React from "react";

import StackTrace from "../../models/stack-trace";

import StackTraceTextItem from "./StackTraceTextItem";

interface StackTraceListItemProps {
    stackTrace: StackTrace;
}

export default class StackTraceListItem extends React.Component<StackTraceListItemProps, any> {

    style() {
        return {
            color: "white",
            margin: "5px"
        };
    }

    render() {
        let fullTrace = this.props.stackTrace.message + this.props.stackTrace.raw;

        return (
            <StackTraceTextItem
                id={this.props.stackTrace.id}
                timestamp={this.props.stackTrace.timestamp}
                level={"CRASH"}
                levelColor={"red"}
                message={fullTrace} />
        );
    }
}