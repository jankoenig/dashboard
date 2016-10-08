import * as React from "react";

import Layout from "../components/Layout";
import Content from "../components/Content";

export default class Login extends React.Component<any, any> {
    render() {
        return (
            <Layout center={true}>
                <Content>
                    {this.props.children}
                </Content>
            </Layout>
        );
    }
}
