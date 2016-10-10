/**
 * Based on https://github.com/tleunen/react-mdl/blob/master/src/Grid/Cell.js
 */
import * as React from "react";
import * as classNames from "classnames";

export type CellAlignment = "top" | "middle" | "bottom" | "stretch";

export interface CellProps {
    align?: CellAlignment;
    col?: number;
    phone?: number;
    tablet?: number;
    offset?: number;
    offsetDesktop?: number;
    offsetTablet?: number;
    offsetPhone?: number;
    hideDesktop?: boolean;
    hidePhone?: boolean;
    hideTablet?: boolean;
};

export default class Cell extends React.Component<CellProps, any> {

    classes() {
        return classNames("mdl-cell", {
                // columns
                [`mdl-cell--${this.props.col}-col`]: this.props.col > 0,
                [`mdl-cell--${this.props.phone}-col-phone`]: this.props.phone > 0,
                [`mdl-cell--${this.props.tablet}-col-tablet`]: this.props.tablet > 0,
                // alignment and offsets
                ["mdl-cell--" + this.props.align]: this.props.align !== null,
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
            <div className={this.classes()}>
                {this.props.children}
            </div>
        );
    }
}
