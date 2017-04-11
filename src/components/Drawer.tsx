import * as classNames from "classnames";
import * as React from "react";

export interface DrawerProps {
    readonly title?: string;
    readonly className?: string;
}

export default class Drawer extends React.Component<DrawerProps, any> {

    classes() {
        return classNames(this.props.className, "mdl-layout__drawer");
    }

    render() {
        return (
            <div className={this.classes()}>
                {this.props.title ? <header className="mdl-layout-title">{this.props.title}</header> : undefined}
                {this.props.children}
            </div>
        );
    }
}
