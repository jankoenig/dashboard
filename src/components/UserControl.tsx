import * as React from "react";

import Button from "../components/Button";
import User from "../models/user";

interface UserProps {
  user?: User;
  login: () => void;
  logout: () => void;
}

export default class UserControl extends React.Component<UserProps, any> {

  render() {

    let callback = this.props.user ? this.props.logout : this.props.login;
    let buttonText = this.props.user ? "Logout" : "Login";

    return (
      <div>
        <button className="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--icon" id="hdrbtn">
          <i className="material-icons">more_vert</i>
        </button>
        <ul className="mdl-menu mdl-js-menu mdl-js-ripple-effect mdl-menu--bottom-right" htmlFor="hdrbtn">
          <li className="mdl-menu__item">{this.props.user.email }</li>
          <li className="mdl-menu__item">
            <Button
              onClick={callback}>
              {buttonText}
            </Button>
          </li>
        </ul>
      </div>
    );
  }
}
