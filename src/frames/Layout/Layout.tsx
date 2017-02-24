import * as React from "react";

import MDLComponent from "../../components/MDLComponent";

const style = require("./layout-style.scss");

export default class Layout extends MDLComponent<any, any> {

    render() {
        return (
            <div className={style.layout}>
                {this.props.children}
            </div>
        );
    }
}
