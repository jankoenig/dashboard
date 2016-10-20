import * as classNames from "classnames";
import * as React from "react";

interface HeaderProps {
  title?: string;
  className?: string;
}

export default class Header extends React.Component<HeaderProps, any> {

  classes() {
    return classNames(this.props.className, "mdl-layout__header");
  }
  render() {
    return (
      <header className={ this.classes() }>
        <div className="mdl-layout__header-row">
          {this.props.title ? (<span className="mdl-layout-title">{this.props.title}</span>) : (undefined)}
          <div className="mdl-layout-spacer" />
          {this.props.children}
        </div>
      </header>);
  }
}