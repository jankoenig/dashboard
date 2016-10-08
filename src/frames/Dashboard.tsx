import * as React from "react";

import Drawer from "../components/Drawer";
import Navigation from "../components/Navigation";
import NavLink from "../components/NavLink";
import Header from "../components/Header";
import Layout from "../components/Layout";
import Content from "../components/Content";

export default class AppFrame extends React.Component<any, any> {
    render() {
        return <Layout drawer={ true }>
                  <Header title="Title" />
                  <Drawer title="You Know">
                    <Navigation>
                      <NavLink path="/" name="Home" icon="home"/>
                      <NavLink path="/logs" name="Logs" icon="subject"/>
                      <NavLink path="/about" name="About" icon="info"/>
                    </Navigation>
                  </Drawer>
                  <Content>
                    { this.props.children }
                  </Content>
              </Layout>;
    }
}
