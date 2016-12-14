import * as React from "react";

export default class Pill extends React.Component<any, any> {

    style(): React.CSSProperties {
        return {
            backgroundColor: "#e53935",
            padding: "5px",
            borderRadius: "5px",
            color: "#eeeeee",
            fontSize: "10px",
            margin: "5px"
        };
    }
    render() {
        return (
            <span style={this.style()}>
                {this.props.children}
            </span>
        );
    }
}