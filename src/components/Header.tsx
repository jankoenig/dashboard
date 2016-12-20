import * as classNames from "classnames";
import * as React from "react";

import Button from "./Button";
import { Menu, MenuItem } from "./Menu";
import { Select, SelectAdapter } from "./Select";

interface HeaderProps {
  selectedIndex?: number;
  titles?: string[];
  className?: string;
  onTitleSelect?: (title: string, index: number) => void;
}

interface HeaderState {
}

export default class Header extends React.Component<HeaderProps, HeaderState> {

  handleTitleSelect(title: string, index: number) {
    if (this.props.onTitleSelect) {
      this.props.onTitleSelect(title, index);
    }
  }

  classes() {
    return classNames(this.props.className, "mdl-layout__header");
  }

  render() {
    let title: JSX.Element = undefined;
    if (this.props.titles && this.props.titles.length > 0) {
      if (this.props.titles.length === 1) {
        title = (<span className="mdl-layout-title">{this.props.titles[0]}</span>);
      } else {
        let index = this.props.selectedIndex || 0;
        title = (<Select adapter={new TitlesAdapter(this.props.titles)} hint="" onSelected={this.handleTitleSelect.bind(this)} defaultIndex={index} />);
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
      </header>
    );
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