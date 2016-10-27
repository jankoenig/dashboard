import * as classNames from "classnames";
import * as React from "react";
import { connect } from "react-redux";
import { push } from "react-router-redux";

import { logout } from "../actions/session";
import Content from "../components/Content";
import Drawer from "../components/Drawer";
import Header from "../components/Header";
import Layout from "../components/Layout";
import Navigation from "../components/Navigation";
import NavLink from "../components/NavLink";
import UserControl from "../components/UserControl";
import { CLASSES } from "../constants";
import User from "../models/user";
import { State } from "../reducers";

interface DashboardProps {
  user?: User;
  login: () => void;
  logout: () => (dispatch: Redux.Dispatch<any>) => void;
}

function mapStateToProps(state: State.All) {
  return {
    user: state.session.user
  };
}

function mapDispatchToProps(dispatch: any) {
  return {
    login: function () {
      dispatch(push("/login"));
    },
    logout: function () {
      return dispatch(logout());
    }
  };
}

class Dashboard extends React.Component<any, any> {

  drawerClasses() {
    return classNames(CLASSES.TEXT.BLUE_GREY_50, CLASSES.COLOR.BLUE_GREY_900);
  }

  headerClasses() {
    return classNames(CLASSES.COLOR.GREY_100, CLASSES.TEXT.GREY_600);
  }

  render() {
    return (
      <Layout header={true}>
        <Header className={this.headerClasses()} >
          <UserControl
            login={this.props.login}
            logout={this.props.logout}
            user={this.props.user} />
        </Header>
        <Content>
          {this.props.children}
        </Content>
      </Layout>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard);