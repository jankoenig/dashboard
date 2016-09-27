import * as React from 'react';
import { Link } from 'react-router';
import * as classNames from 'classnames';

export interface NavLinkProps {
  path: string;
  name: string;
  icon?: string;
}

export default class NavLink extends React.Component<NavLinkProps, any> {
  constructor(props: NavLinkProps) {
    super(props);
  }
  render() {
    return (
      <Link to={ this.props.path } className="mdl-navigation__link"><i className="mdl-color-text--blue-grey-400 material-icons" role="presentation">{ this.props.icon }</i>{ this.props.name }</Link>
    );
  }
}
