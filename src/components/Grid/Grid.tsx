/**
 * Based on https://github.com/tleunen/react-mdl/blob/master/src/Grid/Grid.js
 */
import * as React from "react";
import * as classNames from "classnames";

export interface GridProps {
    noSpacing?: boolean;
}

export default class Grid extends React.Component<GridProps, any> {

    classes() {
        return classNames("mdl-grid", {
            "mdl-grid--no-spacing": this.props.noSpacing
        });
    }
    render() {
        return (
            <div className={this.classes()}>
                {this.props.children}
            </div>
        );
    }
}
