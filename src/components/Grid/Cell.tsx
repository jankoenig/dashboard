import * as classNames from "classnames";
import * as React from "react";

export type CellAlignment = "top" | "middle" | "bottom" | "stretch";

export interface CellProps {
    readonly align?: CellAlignment;
    readonly col?: number;
    readonly phone?: number;
    readonly tablet?: number;
    readonly offset?: number;
    readonly offsetDesktop?: number;
    readonly offsetTablet?: number;
    readonly offsetPhone?: number;
    readonly hideDesktop?: boolean;
    readonly hidePhone?: boolean;
    readonly hideTablet?: boolean;
    readonly style?: React.CSSProperties;
};

/**
 * Cell for a Grid
 *
 * A cell is what defines the columns within a grid.  For MDL, a grid has 12 columns on a desktop
 *   screen, 8 on a tablet and 4 on a phone.
 *
 * Based on react-mdl implementation https://github.com/tleunen/react-mdl/blob/master/src/Grid/Cell.js
 */
export default class Cell extends React.Component<CellProps, any> {

    classes() {
        return classNames("mdl-cell", {
            // columns
            [`mdl-cell--${this.props.col}-col`]: this.props.col > 0,
            [`mdl-cell--${this.props.phone}-col-phone`]: this.props.phone > 0,
            [`mdl-cell--${this.props.tablet}-col-tablet`]: this.props.tablet > 0,
            // alignment and offsets
            ["mdl-cell--" + this.props.align]: this.props.align !== undefined,
            ["mdl-cell--" + this.props.offset + "-offset"]: this.props.offset > 0,
            ["mdl-cell--" + this.props.offsetDesktop + "-offset-desktop"]: this.props.offsetDesktop > 0,
            ["mdl-cell--" + this.props.offsetTablet + "-offset-tablet"]: this.props.offsetTablet > 0,
            ["mdl-cell--" + this.props.offsetPhone + "-offset-phone"]: this.props.offsetPhone > 0,
            // utils
            "mdl-cell--hide-desktop": this.props.hideDesktop,
            "mdl-cell--hide-phone": this.props.hidePhone,
            "mdl-cell--hide-tablet": this.props.hideTablet
        });
    }

    render() {
        return (
            <div className={this.classes()} style={this.props.style}>
                {this.props.children}
            </div>
        );
    }
}
