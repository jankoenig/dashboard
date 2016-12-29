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
  currentSourceId?: string;
  sources?: Array<Dropdownable>;
  onSourceSelected?: (source: Dropdownable) => void;
  displayHomeButton?: boolean;
  className?: string;
}

export interface HeaderState {
  selectedSourceId?: string;
}

/**
 * Header for the Dashboard frame
 *
 * TODO: We may want to consider renaming this since it is not a resuable header
 * component and is instead can only be used by the Dashboard frame.
 */
export class Header extends React.Component<HeaderProps, HeaderState> {

  constructor(props: HeaderProps) {
    super(props);
    this.state = { selectedSourceId: this.props.currentSourceId };
  }

  componentWillReceiveProps(nextProps: HeaderProps, context: any) {
    this.state.selectedSourceId = nextProps.currentSourceId;
    this.setState(this.state);
  }

  classes() {
    return classNames("mdl-layout__header", this.props.className);
  }

  handleItemSelect = (value: string) => {
    this.state.selectedSourceId = value;

    // Now find the source and pass it back out
    for (let item of this.props.sources) {
      if (item.value === value && this.props.onSourceSelected) {
        this.props.onSourceSelected(item);
      }
    }
  }

  render() {
    let title: JSX.Element = undefined;
    if (this.props.sources && this.props.sources.length > 0) {
      if (this.props.sources.length === 1) {
        title = (<span className="mdl-layout-title">{this.props.sources[0].label}</span>);
      } else {
        title = (
          <Dropdown
            theme={DropdownDark}
            auto
            onChange={this.handleItemSelect}
            source={this.props.sources}
            value={this.state.selectedSourceId}
            />
        );
      }
    }

    return (
      <header className={this.classes()}>
        <div className="mdl-layout__header-row" style={{ paddingLeft: "0px" }}>
          {this.props.displayHomeButton ? (
            <Link to={"/"} style={{ paddingLeft: "15px", paddingRight: "15px" }}>
              <i className="material-icons" role="presentation">home</i>
            </Link>
          ) : undefined}
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

export default Header;