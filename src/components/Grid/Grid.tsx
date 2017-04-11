import * as classNames from "classnames";
import * as React from "react";

export interface GridProps {
    readonly noSpacing?: boolean;
    readonly style?: React.CSSProperties;
    readonly className?: string;
}

/**
 * Based on react-mdl implmementation https://github.com/tleunen/react-mdl/blob/master/src/Grid/Grid.js
 */
export default class Grid extends React.Component<GridProps, any> {

    static GRID_CLASS = "mdl-grid";

    classes() {
        return classNames(Grid.GRID_CLASS, {
            "mdl-grid--no-spacing": this.props.noSpacing
        }, this.props.className);
    }
    render() {
        return (
            <div className={this.classes()} style={this.props.style}>
                {this.props.children}
            </div>
        );
    }
}
