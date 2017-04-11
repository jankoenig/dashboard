import * as React from "react";

import Output from "../../models/output";
import ListItemMessage from "./ListItemMessage";

interface OutputListItemProps {
    readonly output: Output;
}

export default class OutputListItem extends React.Component<OutputListItemProps, any> {

    render() {
        return (
            <li key={this.props.output.id}>
                <ListItemMessage
                    timestamp={this.props.output.timestamp}
                    level={this.props.output.level}
                    levelColor={this.props.output.levelColor}
                    message={this.props.output.message} />
            </li>
        );
    }
}