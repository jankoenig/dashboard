import * as React from "react";
import * as classNames from "classnames";

export interface LayoutProps {
    drawer?: boolean;
    header?: boolean;
    center?: boolean;
};

export default class Layout extends React.Component<LayoutProps, any> {

    classes() {
        return classNames("mdl-layout mdl-js-layout", {
            "mdl-layout--fixed-drawer": this.props.drawer,
            "mdl-layout--fixed-header": this.props.header
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
