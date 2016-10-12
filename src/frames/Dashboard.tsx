import * as React from "react";
import { connect } from "react-redux";

import Drawer from "../components/Drawer";
import Navigation from "../components/Navigation";
import NavLink from "../components/NavLink";
import Header from "../components/Header";
import Layout from "../components/Layout";
import Content from "../components/Content";
import UserControl from "../components/UserControl";

import { Store } from "../reducers";
import User from "../models/user";

interface DashboardProps {
  user?: User;
}

function mapStateToProps(state: Store.All) {
  return {
    user: state.session.user
  };
}

function mapDispatchToProps(dispatch: any) {
  return {

  };
}

class Dashboard extends React.Component<any, any> {
    render() {
        return <Layout drawer={ true }>
                  <Header title="Title" />
                  <Drawer title="You Know">
                    <Navigation>
                      <NavLink path="/" name="Home" icon="home"/>
                      <NavLink path="/logs" name="Logs" icon="subject"/>
                      <NavLink path="/about" name="About" icon="info"/>
                    </Navigation>
                    <UserControl />
                  </Drawer>
                  <Content>
                    { this.props.children }
                  </Content>
              </Layout>;
    }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard);