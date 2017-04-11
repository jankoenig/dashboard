import * as classNames from "classnames";
import * as React from "react";
import FontIcon from "react-toolbox/lib/font_icon";

import StackTrace from "../../models/stack-trace";
import ListItemMessage from "./ListItemMessage";

const style = require("./StackTraceListItemStyle.scss");

interface StackTraceListItemProps {
    readonly stackTrace: StackTrace;
}

interface StackTraceListItemState {
    readonly displayElements: boolean;
}

class StackTraceListItem extends React.Component<StackTraceListItemProps, StackTraceListItemState> {

    constructor(props: StackTraceListItemProps) {
        super(props);
        this.state = {
            displayElements: false
        };

        this.onClick = this.onClick.bind(this);
    }

    elementsClassName() {
        return classNames(style.elementsList, {
            [style.display]: this.state.displayElements
        });
    }

    onClick(event: React.MouseEvent) {
        this.setState({ displayElements: !this.state.displayElements });
    }

    render() {
        let elements: JSX.Element[] = [];

        for (let element of this.props.stackTrace.elements) {
            elements.push(<li key={element.line + element.file}> <p> {element.raw} </p></li>);
        }

        return (
            <li key={this.props.stackTrace.id}>
                <ListItemMessage
                    style={{ cursor: "pointer" }}
                    onClick={this.onClick}
                    timestamp={this.props.stackTrace.timestamp}
                    level={"EXCEPTION"}
                    levelColor={"red"}
                    message={this.props.stackTrace.message} >
                    <FontIcon value={this.state.displayElements ? "expand_less" : "expand_more"} />
                </ListItemMessage>
                <ul className={this.elementsClassName()}>
                    {elements}
                </ul>
            </li>
        );
    }
}

export default StackTraceListItem;