import * as classNames from "classnames";
import * as React from "react";
import { connect } from "react-redux";
import { push, replace } from "react-router-redux";

import { logout } from "../actions/session";
import { getSources, setCurrentSource } from "../actions/source";
import Content from "../components/Content";
import { Header, HeaderTitleAdapter } from "../components/Header";
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
  goTo: (path: string) => (dispatch: Redux.Dispatch<any>) => void;
  location: Location;
}

interface DashboardState {
  adapter: SourceAdapter;
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
    goTo: function(path: string) {
      return dispatch(replace(path));
    }
  };
}

class Dashboard extends React.Component<DashboardProps, DashboardState> {

  constructor(props: DashboardProps) {
    super(props);
    this.state = {
      adapter: new SourceAdapter(this.props.sources)
    };
  }

  drawerClasses() {
    return classNames(CLASSES.TEXT.BLUE_GREY_50, CLASSES.COLOR.BLUE_GREY_900);
  }

  headerClasses() {
    return classNames(CLASSES.COLOR.GREY_100, CLASSES.TEXT.GREY_600);
  }

  componentWillMount() {
    this.props.getSources();
  }

  componentWillReceiveProps(nextProps: DashboardProps, context: any) {
    this.state.adapter = new SourceAdapter(nextProps.sources);
    this.setState(this.state);
  }

  handleSelectedSource(index: number) {
    let source = this.state.adapter.getItem(index);
    this.props.setSource(source);

    let currentPath = this.props.location.pathname;
    let newPath = currentPath.replace(this.props.currentSource.id, source.id);

    this.props.goTo(newPath);
  }

  indexOf(source: Source): number | undefined {
    if (source) {
      let adapter = this.state.adapter;
      let maxCount = adapter.getCount();
      for (let i = 0; i < maxCount; ++i) {
        if (adapter.getItem(i).id === source.id) {
          return i;
        }
      }
    }
    return undefined;
  }

  render() {
    return (
      <Layout header={true}>
        <Header
          className={this.headerClasses()}
          selectedIndex={this.indexOf(this.props.currentSource)}
          items={this.props.currentSource ? new SourceAdapter(this.props.sources) : undefined}
          onItemSelect={this.handleSelectedSource.bind(this)}
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

class SourceAdapter implements HeaderTitleAdapter<Source> {
  readonly sources: Source[];

  constructor(source: Source[]) {
    this.sources = (source) ? source : [];
  }

  getCount(): number {
    return this.sources.length;
  }

  getItem(index: number): Source {
    return this.sources[index];
  }

  getTitle(index: number): string {
    return this.sources[index].name;
  }
}