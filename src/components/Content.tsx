import * as classNames from "classnames";
import * as React from "react";



export default class Content extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
    }

    classes() {
        return classNames("mdl-layout__content", this.props.classNames);
    }

    render() {
        return (
            <main style={this.props.style} className={this.classes()}>
                {this.props.children}
            </main>
        );
    }
}
