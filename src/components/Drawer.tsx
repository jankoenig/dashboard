import * as classNames from "classnames";
import * as React from "react";

export interface DrawerProps {
    title?: string;
}

export default class Drawer extends React.Component<DrawerProps, any> {

    classes() {
        return classNames("mdl-layout__drawer mdl-color--blue-grey-900 mdl-color-text--blue-grey-50");
    }

    render() {
        return (
            <div className={ this.classes() }>
                { this.props.title ? <header className="mdl-layout-title">{this.props.title}</header> : undefined }
                { this.props.children }
            </div>);
    }
}
