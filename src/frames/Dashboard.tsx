import * as classNames from "classnames";
import * as React from "react";
import { connect } from "react-redux";
import { push } from "react-router-redux";

import { logout } from "../actions/session";
import { getSources, setCurrentSource } from "../actions/source";
import Content from "../components/Content";
import Drawer from "../components/Drawer";
import Header from "../components/Header";
import Layout from "../components/Layout";
import Navigation from "../components/Navigation";
import NavLink from "../components/NavLink";
import UserControl from "../components/UserControl";
import { CLASSES } from "../constants";
import Source from "../models/source";
import User from "../models/user";
import { State } from "../reducers";

/**
 * Extend the Element object with the MaterialLayout.toggleDrawer function
 * so we can close the drawer
 */
interface MDLElement extends Element {
    MaterialLayout: {
      toggleDrawer: () => void;
    };
}

interface DashboardProps {
  user: User;
  currentSource: Source;
  sources: Source[];
  login: () => void;
  logout: () => (dispatch: Redux.Dispatch<any>) => void;
  getSources: () => Redux.ThunkAction<any, any, any>;
  setSource: (source: Source) => (dispatch: Redux.Dispatch<any>) => void;
  location: Location;
}

function mapStateToProps(state: State.All) {
  return {
    user: state.session.user,
    currentSource: state.source.currentSource,
    sources: state.source.sources
  };
}

function mapDispatchToProps(dispatch: any) {
  return {
    login: function () {
      dispatch(push("/login"));
    },
    logout: function () {
      return dispatch(logout());
    },
    getSources: function () {
      return dispatch(getSources());
    },
    setSource: function(source: Source) {
      return dispatch(setCurrentSource(source));
    }
  };
}

class Dashboard extends React.Component<DashboardProps, any> {

  drawerClasses() {
    return classNames(CLASSES.TEXT.BLUE_GREY_50, CLASSES.COLOR.BLUE_GREY_900);
  }

  headerClasses() {
    return classNames(CLASSES.COLOR.GREY_100, CLASSES.TEXT.GREY_600);
  }

  componentWillMount() {
    this.props.getSources();
  }

  componentWillReceiveProps(nextProps: DashboardProps) {

    // Solution suggested by https://github.com/react-mdl/react-mdl/issues/254#issuecomment-237926011 for
    // closing the navigation drawer after a click
    //
    // If our locations are different and drawer is open, force a close
    if (this.props.location.pathname !== nextProps.location.pathname) {
      const layout = document.querySelector(".mdl-js-layout") as MDLElement;
      const drawer = document.querySelector(".mdl-layout__drawer");

      if (layout.classList.contains("is-small-screen") && drawer.classList.contains("is-visible")) {
        layout.MaterialLayout.toggleDrawer();
      }
    }
  }

  handleSelectedSource(title: string, index: number) {
    console.info("SELECTING " + index + " " + title);
    let source = this.getSource(title);
    if (source) {
      console.info("SETTING");
      this.props.setSource(source);
    }
  }

  titles(): string[] {
    let titles: string[] = [];
    let sources = this.props.sources;
    let count = sources.length;
    for (let i = 0; i < count; ++i) {
      titles.push(sources[i].name);
    }
    return titles;
  }

  getSource(title: string): Source {
    let sources = this.props.sources;
    let count = sources.length;
    for (let i = 0; i < count; ++i) {
      if (sources[i].name === title) {
        return sources[i];
      }
    }
    return undefined;
  }

  render() {
    return (
      <Layout drawer={true} header={true}>
        <Header
          className={this.headerClasses()}
          titles={this.props.currentSource ? this.titles() : undefined}
          onTitleSelect={this.handleSelectedSource.bind(this)}>
          <UserControl
            login={this.props.login}
            logout={this.props.logout}
            user={this.props.user} />
        </Header>
        <Drawer className={this.drawerClasses()} >
          <Navigation className={CLASSES.COLOR.BLUE_GREY_800}>
            <NavLink className={CLASSES.TEXT.BLUE_GREY_400} path="/" name="Home" icon="home" />
            <NavLink className={CLASSES.TEXT.BLUE_GREY_400} path="/skills/new" name="New Skill" icon="add" />
            <NavLink className={CLASSES.TEXT.BLUE_GREY_400} path="/skills" name="My Skills" icon="subject" />
          </Navigation>
        </Drawer>
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