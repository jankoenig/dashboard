import * as classNames from "classnames";
import * as React from "react";

import Content from "../components/Content";
import Layout from "../components/Layout";
import { CLASSES } from "../constants";

export default class Login extends React.Component<any, any> {

    classes() {
        return classNames(this.props.classNames, CLASSES.COLOR.GREY_100);
    }

    render() {
        return (
            <Layout>
                <Content classNames={ this.classes() } >
                    {this.props.children}
                </Content>
            </Layout>
        );
    }
}
