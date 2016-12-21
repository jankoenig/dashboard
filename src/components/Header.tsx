import * as classNames from "classnames";
import * as React from "react";
import { Link } from "react-router";

import Button from "./Button";
import { Menu, MenuItem } from "./Menu";
import { Select } from "./Select";

export interface HeaderTitleAdapter<T> {
  getCount(): number;
  getItem(index: number): T;
  getTitle(index: number): string;
}

export interface HeaderProps {
  selectedIndex?: number;
  items?: HeaderTitleAdapter<any>;
  className?: string;
  onItemSelect?: (index: number) => void;
  displayHomeButton?: boolean;
}

interface HeaderState {
}

export class Header extends React.Component<HeaderProps, HeaderState> {

  handleTitleSelect(item: any, index: number) {
    if (this.props.onItemSelect) {
      this.props.onItemSelect(index);
    }
  }

  classes() {
    return classNames(this.props.className, "mdl-layout__header");
  }

  render() {
    let title: JSX.Element = undefined;
    if (this.props.items && this.props.items.getCount() > 0) {
      if (this.props.items.getCount() === 1) {
        title = (<span className="mdl-layout-title">{this.props.items.getTitle(0)}</span>);
      } else {
        let index = this.props.selectedIndex || 0;
        title = (<Select adapter={this.props.items} hint="" onSelected={this.handleTitleSelect.bind(this)} defaultIndex={index} />);
      }
    }

    return (
      <header className={this.classes()}>
        <div className="mdl-layout__header-row" style={{ paddingLeft: "0px" }}>
          {this.props.displayHomeButton ? (
            <Link to={"/"} style={{paddingLeft: "15px", paddingRight: "15px"}}>
              <i className="material-icons" role="presentation">home</i>
            </Link>
          ) : (undefined)}
          {title}
          <div className="mdl-layout-spacer" />
          {this.props.children}
          <Button id="support">
            <i className="material-icons"
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

export default Header;