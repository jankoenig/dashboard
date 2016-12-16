import * as moment from "moment";
import * as React from "react";

import StackTrace from "../../models/stack-trace";
import StackTraceElement from "../../models/stack-trace-element";

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

        let stackTraceElements: JSX.Element[] = [];

        for (let stackTraceElement of this.props.stackTrace.elements) {
            stackTraceElements.push(
                <p style={ {margin: "0px", fontSize: "12px", lineHeight: "14px" }}>{ stackTraceElement.raw }</p>
            );
        }

        return (
            <li key={this.props.stackTrace.id} style={this.style()}>
                <span style={{color: "rgb(102, 217, 239)", paddingRight: "10px"}}>
                    {moment(this.props.stackTrace.timestamp).format("hh:mm:ss.SSSSS")}
                </span>
                <span style={{ color: "red" }}>
                    CRASH
                </span>
                <span style={{paddingLeft: "10px", color: "#EEEEEE"}}>
                    {this.props.stackTrace.message}
                </span>
                { stackTraceElements }
            </li>
        );
    }
}