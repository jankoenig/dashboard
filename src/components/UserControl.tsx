import * as React from "react";

import Button from "../components/Button";
import User from "../models/User";

interface UserProps {
  user?: User;
  login: () => void;
  logout: () => void;
}

export default class UserControl extends React.Component<UserProps, any> {

  emailStyle() {
    return {
      padding: "10px"
    };
  }

  buttonStyle() {
    return {
      float: "right"
    };
  }

  render() {

    let callback = this.props.user ? this.props.logout : this.props.login;
    let buttonText = this.props.user ? "Logout" : "Login";

    return (
      <header>
        { this.props.user ? (<p style={ this.emailStyle() }>Hello {this.props.user.email}! </p>) : undefined }
        <Button style={ this.buttonStyle() } className="mdl-color-text--blue-grey-400" onClick={ callback }> {buttonText }</Button>
      </header>
    );
  }
}
