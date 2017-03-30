import * as classNames from "classnames";
import * as React from "react";
import { connect } from "react-redux";
import { push, replace } from "react-router-redux";

import { logout } from "../actions/session";
import { getSources, setCurrentSource } from "../actions/source";
import UserControl from "../components/UserControl";
import { CLASSES } from "../constants";
import Source from "../models/source";
import User from "../models/user";
import { State } from "../reducers";
import { Body, Content, Dropdownable, Header, Layout, Navigation, NavigationMenu, PageButton } from "./Layout";

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
  user: User;
  currentSource: Source;
  sources: Source[];
  location: Location;
  login: () => (dispatch: Redux.Dispatch<any>) => void;
  logout: () => (dispatch: Redux.Dispatch<any>) => void;
  getSources: () => Redux.ThunkAction<any, any, any>;
  setSource: (source: Source) => (dispatch: Redux.Dispatch<any>) => void;
  goTo: (path: string) => (dispatch: Redux.Dispatch<any>) => void;
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
          icon: "av_timer",
          name: "sessions"
        },
        {
          icon: "list",
          name: "logs"
        },
        {
          icon: "code",
          name: "integration"
        },
        {
          icon: "settings",
          name: "settings"
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
    } else if (button.name === "sessions") {
      this.props.goTo("/skills/" + this.props.currentSource.id + "/sessions");
    } else if (button.name === "settings") {
      this.props.goTo("/skills/" + this.props.currentSource.id + "/settings");
    }
  }

  handleHomeClick() {
    this.props.goTo("/");
  }

  render() {
    return (
      <Layout>
        <Header
          className={this.headerClasses()}
          currentSourceId={this.props.currentSource ? this.props.currentSource.id : undefined}
          sources={this.props.currentSource ? this.dropdownableSources() : undefined}
          onSourceSelected={this.handleSelectedSource}
          onHomeClicked={this.handleHomeClick}
          displayHomeButton={this.props.location.pathname !== "/"}>
          <UserControl
            login={this.props.login}
            logout={this.props.logout}
            user={this.props.user}
            goTo={this.props.goTo} />
        </Header>
        <Body>
          <Content>
            {this.props.children}
          </Content>
          {this.pageButtons() ? (
            <Navigation>
              <NavigationMenu
                pageButtons={this.pageButtons()}
                onPageSelected={this.handlePageSwap} />
            </Navigation>
          ) : undefined}
        </Body>
      </Layout>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard);