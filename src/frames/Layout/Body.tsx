import * as React from "react";

const style = require("./style.scss");

export default class Body extends React.Component<any, any> {

  render() {
    return (
      <div className={style.body}>
        {this.props.children}
      </div>
    );
  }
}