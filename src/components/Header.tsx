import * as classNames from "classnames";
import * as React from "react";

import { Button } from "react-toolbox/lib/button";
import { DatePicker } from "react-toolbox/lib/date_picker";

// import Button from "./Button";
import { Menu, MenuItem } from "./Menu";

interface HeaderProps {
  title?: string;
  className?: string;
}

export default class Header extends React.Component<HeaderProps, any> {

  classes() {
    return classNames(this.props.className, "mdl-layout__header");
  }

  handleChange() {

  }

  render() {
    return (
      <header className={this.classes()}>
      <DatePicker label="First" onChange={this.handleChange.bind(this)} />
      <Button icon="bookmark" label="Bookmark" accent />
        <div className="mdl-layout__header-row">
          {this.props.title ? (<span className="mdl-layout-title">{this.props.title}</span>) : (undefined)}
          <div className="mdl-layout-spacer" />
          {this.props.children}
          <Button label="support">
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