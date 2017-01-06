import * as React from "react";

import StackTrace from "../../models/stack-trace";
import ListItemMessage from "./ListItemMessage";

const style = require("./StackTraceListItem.scss");

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
        let elements: JSX.Element[] = [];

        for (let element of this.props.stackTrace.elements) {
            elements.push(<li key={element.line + element.file}> <p> {element.raw} </p></li>);
        }

        return (
            <li key={this.props.stackTrace.id}>
                <ListItemMessage
                    style={{cursor: "pointer"}}
                    timestamp={this.props.stackTrace.timestamp}
                    level={"CRASH"}
                    levelColor={"red"}
                    message={this.props.stackTrace.message} />
                <ul className={style.elementsList}>
                    {elements}
                </ul>
            </li>
        );
    }
}