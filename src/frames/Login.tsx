import * as React from "react";

import Content from "../components/Content";
import Layout from "../components/Layout";

export default class Login extends React.Component<any, any> {
    render() {
        return (
            <Layout>
                <Content>
                    {this.props.children}
                </Content>
            </Layout>
        );
    }
}
