import * as classNames from "classnames";
import * as React from "react";
import { connect } from "react-redux";
import { push, replace } from "react-router-redux";

import { logout } from "../actions/session";
import { getSources, setCurrentSource } from "../actions/source";
import Content from "../components/Content";
import { Dropdownable, Header, PageButton } from "../components/Header";
import Layout from "../components/Layout";
import UserControl from "../components/UserControl";
import { CLASSES } from "../constants";
import Source from "../models/source";
import User from "../models/user";
import { State } from "../reducers";

/**
 * Simple Adapter so a Source can conform to Dropdownable
 */
class SourceDropdownableAdapter implements Dropdownable {

  constructor(readonly source: Source) {
  }

  get value() {
    return this.source.id;
  }

  get label() {
    return this.source.name;
  }

}

interface DashboardProps {
  readonly user: User;
  readonly currentSource: Source;
  readonly sources: Source[];
  readonly location: Location;
  readonly login: () => (dispatch: Redux.Dispatch<any>) => void;
  readonly logout: () => (dispatch: Redux.Dispatch<any>) => void;
  readonly getSources: () => Redux.ThunkAction<any, any, any>;
  readonly setSource: (source: Source) => (dispatch: Redux.Dispatch<any>) => void;
  readonly goTo: (path: string) => (dispatch: Redux.Dispatch<any>) => void;
}

interface DashboardState {
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
      return dispatch(push("/login"));
    },
    logout: function () {
      return dispatch(logout());
    },
    getSources: function () {
      return dispatch(getSources());
    },
    setSource: function (source: Source) {
      return dispatch(setCurrentSource(source));
    },
    goTo: function (path: string) {
      return dispatch(replace(path));
    }
  };
}

class Dashboard extends React.Component<DashboardProps, DashboardState> {

  constructor(props: DashboardProps) {
    super(props);

    this.handleSelectedSource = this.handleSelectedSource.bind(this);
    this.handlePageSwap = this.handlePageSwap.bind(this);
    this.handleHomeClick = this.handleHomeClick.bind(this);
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

  handleSelectedSource(sourceDropdownableAdapter: SourceDropdownableAdapter) {
    this.props.setSource(sourceDropdownableAdapter.source);

    let currentPath = this.props.location.pathname;
    let newPath = currentPath.replace(this.props.currentSource.id, sourceDropdownableAdapter.source.id);

    this.props.goTo(newPath);
  }

  dropdownableSources(): SourceDropdownableAdapter[] {
    let dropdownableSources = [];

    for (let source of this.props.sources) {
      dropdownableSources.push(new SourceDropdownableAdapter(source));
    }

    return dropdownableSources;
  }

  indexOf(source: Source): number {
    if (source) {
      let length = this.props.sources.length;
      for (let i = 0; i < length; ++i) {
        if (this.props.sources[i].id === source.id) {
          return i;
        }
      }
    }

    return -1;
  }

  pageButtons(): PageButton[] | undefined {
    if (this.props.currentSource) {
      return [
        {
          icon: "dashboard",
          name: "summary"
        },
        {
          icon: "list",
          name: "logs"
        },
        {
          icon: "code",
          name: "integration"
        }
      ];
    } else {
      return undefined;
    }
  }

  handlePageSwap(button: PageButton) {
    if (button.name === "summary") {
      this.props.goTo("/skills/" + this.props.currentSource.id);
    } else if (button.name === "logs") {
      this.props.goTo("/skills/" + this.props.currentSource.id + "/logs");
    } else if (button.name === "integration") {
      this.props.goTo("/skills/" + this.props.currentSource.id + "/integration");
    }
  }

  handleHomeClick() {
    this.props.goTo("/");
  }

  render() {
    return (
      <Layout header={true}>
        <Header
          className={this.headerClasses()}
          currentSourceId={this.props.currentSource ? this.props.currentSource.id : undefined}
          sources={this.props.currentSource ? this.dropdownableSources() : undefined}
          pageButtons={this.pageButtons()}
          onPageSelected={this.handlePageSwap}
          onSourceSelected={this.handleSelectedSource}
          onHomeClicked={this.handleHomeClick}
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