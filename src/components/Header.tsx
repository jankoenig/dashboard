import * as classNames from "classnames";
import * as React from "react";
import { Link } from "react-router";
import Dropdown from "react-toolbox/lib/dropdown";

import Button from "./Button";
import { Menu, MenuItem } from "./Menu";

const DropdownDark = require("../themes/dropdown-dark.scss");

export interface Dropdownable {
  value: string;
  label: string;
}

export interface HeaderProps {
  selectedIndex?: number;
  items?: Array<Dropdownable>;
  className?: string;
  onItemSelected?: (item: Dropdownable) => void;
  displayHomeButton?: boolean;
}

interface HeaderState {
  selectedItem?: string;
}

export class Header extends React.Component<HeaderProps, HeaderState> {

  constructor(props: HeaderProps) {
    super(props);
    this.state = { selectedItem: "kj" };
  }

  classes() {
    return classNames(this.props.className, "mdl-layout__header");
  }

  handleItemSelect = (value: string, event: any) => {
    console.log("handleTitleSelect");
    console.log(value);
    console.log(this.props.items);
    this.setState({ selectedItem: value });
    if (this.props.onItemSelected) {
      for (let item of this.props.items) {
        if (item.value === value) {
          this.props.onItemSelected(item);
        }
      }
      // this.props.onItemSelected(this.props.items[value]);
    }
  }

  render() {

    let title: JSX.Element = undefined;
    if (this.props.items && this.props.items.length > 0) {
      title = (
        <Dropdown
          theme={DropdownDark}
          auto
          onChange={this.handleItemSelect}
          source={this.props.items}
          value={this.state.selectedItem}
          />
      );
    }

    return (
      <header className={this.classes()}>
        <div className="mdl-layout__header-row" style={{ paddingLeft: "0px" }}>
          {this.props.displayHomeButton ? (
            <Link to={"/"} style={{ paddingLeft: "15px", paddingRight: "15px" }}>
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