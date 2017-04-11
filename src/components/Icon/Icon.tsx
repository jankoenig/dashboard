import * as objectAssign from "object-assign";
import * as React from "react";

import ICON from "./constants";

export interface IconProps {
    readonly icon: ICON;
    readonly style?: React.CSSProperties;
    readonly width?: number;
    readonly height?: number;
    readonly color?: string;
}

/**
 * Icon Component
 *
 * Followed David Gilberton's example at https://medium.com/@david.gilbertson/icons-as-react-components-de3e33cb8792
 */
export default class Icon extends React.Component<IconProps, any> {

    styles() {
        return objectAssign({
            display: "inline-block",
            verticalAlign: "middle",
        }, this.props.style);
    }

    render() {
        return (
            <svg
                style={this.styles()}
                width={this.props.width}
                height={this.props.height}
                viewBox="0 0 1024 1024"
                preserveAspectRatio="xMidYMin">
                <path
                    d={this.props.icon.path}
                    style={{ fill: this.props.color }}
                    />
            </svg>
        );
    }
}
