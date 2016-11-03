import * as classNames from "classnames";
import * as React from "react";

import MDLComponent from "./MDLComponent";

export interface LayoutProps {
    drawer?: boolean;
    header?: boolean;
    style?: React.CSSProperties;
};

export default class Layout extends MDLComponent<LayoutProps, any> {

    classes() {
        return classNames("mdl-layout mdl-js-layout", {
            "mdl-layout--fixed-drawer": this.props.drawer,
            "mdl-layout--fixed-header": this.props.header
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
