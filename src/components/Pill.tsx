import * as React from "react";

import { COLORS } from "../constants";

interface PillProps {
    style?: React.CSSProperties;
    onClick?: (event: React.MouseEvent) => void;
}

export default class Pill extends React.Component<PillProps, any> {

    style(): React.CSSProperties {
        return {
            ...{
                backgroundColor: COLORS.ICONS.PRIMARY,
                padding: "5px",
                borderRadius: "5px",
                color: "#eeeeee",
                fontSize: "10px",
                margin: "5px",
                WebkitUserSelect: "none",
                msUserSelect: "none",
                MozUserSelect: "none",
                cursor: "default"
            }, ...this.props.style
        };
    }
    render() {
        return (
            <span style={this.style()} onClick={this.props.onClick}>
                {this.props.children}
            </span>
        );
    }
}