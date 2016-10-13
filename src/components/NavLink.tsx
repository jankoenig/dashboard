import * as React from "react";
import { Link } from "react-router";

export interface NavLinkProps {
  path: string;
  name: string;
  icon?: string;
}

export default class NavLink extends React.Component<NavLinkProps, any> {

  style() {
    return {
      marginRight: "32px"
    };
  }

  render() {
    return (
      <Link to={ this.props.path } className="mdl-navigation__link"><i style={ this.style() } className="mdl-color-text--blue-grey-400 material-icons" role="presentation">{ this.props.icon }</i>{ this.props.name }</Link>
    );
  }
}
