import * as classNames from "classnames";
import * as React from "react";

export interface GridProps {
    noSpacing?: boolean;
}

/**
 * Based on react-mdl implmementation https://github.com/tleunen/react-mdl/blob/master/src/Grid/Grid.js
 */
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
