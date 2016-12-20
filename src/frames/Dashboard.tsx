import * as classNames from "classnames";
import * as React from "react";
import { connect } from "react-redux";
import { push, replace } from "react-router-redux";

import { logout } from "../actions/session";
import { getSources, setCurrentSource } from "../actions/source";
import Content from "../components/Content";
import Header from "../components/Header";
import Layout from "../components/Layout";
import UserControl from "../components/UserControl";
import { CLASSES } from "../constants";
import Source from "../models/source";
import User from "../models/user";
import { State } from "../reducers";

interface DashboardProps {
  user: User;
  currentSource: Source;
  sources: Source[];
  login: () => void;
  logout: () => (dispatch: Redux.Dispatch<any>) => void;
  getSources: () => Redux.ThunkAction<any, any, any>;
  setSource: (source: Source) => (dispatch: Redux.Dispatch<any>) => void;
  goToSource: (source: Source) => (dispatch: Redux.Dispatch<any>) => void;
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
    },
    goToSource: function(source: Source) {
      return dispatch(replace("/skills/" + source.id));
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

  handleSelectedSource(title: string, index: number) {
    let source = this.getSource(title);
    if (source) {
      this.props.setSource(source);
      this.props.goToSource(source);
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
      <Layout header={true}>
        <Header
          className={this.headerClasses()}
          selectedIndex={this.props.currentSource ? this.titles().indexOf(this.props.currentSource.name) : undefined}
          titles={this.props.currentSource ? this.titles() : undefined}
          onTitleSelect={this.handleSelectedSource.bind(this)}
          displayHomeButton={this.props.location.pathname !== "/"}>
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