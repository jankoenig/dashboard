import * as classNames from "classnames";
import * as React from "react";
import { Link } from "react-router";

export interface NavLinkProps {
  path: string;
  name: string;
  icon?: string;
  className?: string;
}

export default class NavLink extends React.Component<NavLinkProps, any> {

  iconStyle() {
    return {
      marginRight: "32px"
    };
  }

  classes() {
    return classNames(this.props.className, "mdl-navigation__link");
  }

  render() {
    return (
      <Link
        to={this.props.path}
        className={this.classes()}>
        {this.props.icon ? (
          <i
            style={this.iconStyle()}
            className="material-icons"
            role="presentation">
            {this.props.icon}
          </i>
        ) : undefined}
        {this.props.name}
      </Link>
    );
  }
}
