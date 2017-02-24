import * as React from "react";

const style = require("./layout-style.scss");

export default class Navigation extends React.Component<any, any> {

  render() {
    return (
      <nav className={style.nav}>
        {this.props.children}
      </nav>
    );
  }
}
