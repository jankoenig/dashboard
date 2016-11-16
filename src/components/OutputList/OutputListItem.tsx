import * as moment from "moment";
import * as React from "react";

import Output from "../../models/output";

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
            <li key={this.props.output.id} style={this.style()}>
                <span style={{color: "rgb(102, 217, 239)", paddingRight: "10px"}}>
                    {moment(this.props.output.timestamp).format("hh:mm:ss.SSSSS")}
                </span>
                <span style={{ color: this.props.output.levelColor }}>
                    {this.props.output.level}
                </span>
                <span style={{paddingLeft: "10px", color: "#EEEEEE"}}>
                    {this.props.output.message}
                </span>
            </li>
        );
    }
}