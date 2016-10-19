import * as React from "react";

interface HeaderProps {
  title?: string;
}

export default class Header extends React.Component<HeaderProps, any> {

  render() {
    return (
      <header className="mdl-layout__header mdl-color--grey-100 mdl-color-text--grey-600">
        <div className="mdl-layout__header-row">
          {this.props.title ? (<span className="mdl-layout-title">{this.props.title}</span>) : (undefined)}
          <div className="mdl-layout-spacer" />
          {this.props.children}
        </div>
      </header>);
  }
}