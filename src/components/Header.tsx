import * as classNames from "classnames";
import * as React from "react";

import Button from "./Button";
import { Menu, MenuItem } from "./Menu";
import { Select, SelectAdapter } from "./Select";

interface HeaderProps {
  titles?: string[];
  className?: string;
  onTitleSelect?: (title: string, index: number) => void;
}

interface HeaderState {
  selectedTitle: string;
}

export default class Header extends React.Component<HeaderProps, HeaderState> {

  constructor(props: HeaderProps) {
    super(props);
    this.state = {
      selectedTitle: (props.titles) ? props.titles[0] : undefined
    };
  }

  componentWillReceiveProps(nextProps: HeaderProps, ctx: any) {
    // Starting over with title since we're brand new
    this.state.selectedTitle = (nextProps.titles) ? nextProps.titles[0] : undefined;
    this.setState(this.state);
  }

  handleTitleSelect(title: string, index: number) {
    console.info("SELECTED " + title + " " + index);
    if (this.props.onTitleSelect) {
      this.props.onTitleSelect(title, index);
    }
  }

  classes() {
    return classNames(this.props.className, "mdl-layout__header");
  }

  render() {
    let title: JSX.Element = undefined;
    if (this.state.selectedTitle) {
      if (this.props.titles.length === 1) {
        title = (<span className="mdl-layout-title">{this.state.selectedTitle}</span>);
      } else {
        title = (<Select adapter={new TitlesAdapter(this.props.titles)} hint="" onSelected={this.handleTitleSelect.bind(this)}/>);
      }
    }

    return (
      <header className={this.classes()}>
        <div className="mdl-layout__header-row">
          {title}
          <div className="mdl-layout-spacer" />
          {this.props.children}
          <Button id="support">
            <i
              className="material-icons"
              role="presentation">help_outline
          </i>
          </Button>
          <Menu align="right" valign="bottom" ripple={true} target="support" >
            <MenuItem>
              <Button href="https://github.com/bespoken/dashboard/issues/new?labels=bug">
                <i
                  style={{ paddingRight: "10px" }}
                  className="material-icons"
                  role="presentation">bug_report</i>
                File Bug
              </Button>
            </MenuItem>
            <MenuItem>
              <Button href="https://github.com/bespoken/dashboard/issues/new?labels=feature%20request&body=">
                <i
                  style={{ paddingRight: "10px" }}
                  className="material-icons"
                  role="presentation">build</i>
                Request Feature
                  </Button>
            </MenuItem>
            <MenuItem>
              <Button href="https://gitter.im/bespoken/bst?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge">
                <i
                  style={{ paddingRight: "10px" }}
                  className="material-icons"
                  role="presentation">question_answer</i>
                Talk to Us
              </Button>
            </MenuItem>
            <MenuItem>
              <Button href="mailto:contact@bespoken.tools">
                <i
                  style={{ paddingRight: "10px" }}
                  className="material-icons"
                  role="presentation">email</i>
                Email
              </Button>
            </MenuItem>
          </Menu>
        </div>
      </header>);
  }
}

class TitlesAdapter implements SelectAdapter<string> {

    titles: string[];

    constructor(titles: string[]) {
      this.titles = titles;
    }

    getCount(): number {
      return this.titles.length;
    };

    getItem(index: number): string {
      return this.titles[index];
    };

    getTitle(index: number): string {
      return this.titles[index];
    }
}