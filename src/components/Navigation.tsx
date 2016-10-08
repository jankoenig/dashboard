import * as React from "react";
import * as classNames from "classnames";

export default class Navigation extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
  }

  classes() {
    return classNames("mdl-navigation mdl-color--blue-grey-800");
  }

  render() {
    return <nav className={ this.classes() }>
             { this.props.children }
           </nav>;
  }
}
