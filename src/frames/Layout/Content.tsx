import * as React from "react";

const style = require("./style.scss");

export default class Content extends React.Component<any, any> {

    render() {
        return (
            <main className={style.content}>
                {this.props.children}
            </main>
        );
    }
}
