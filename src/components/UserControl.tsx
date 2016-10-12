import * as React from "react";

import Button from "../components/Button";
import User from "../models/User";

interface UserProps {
    user?: User;
}

export default class UserControl extends React.Component<UserProps, any> {
  constructor(props: any) {
    super(props);
  }

  handleLogout () {
    console.log("logout");
  }

  handleLogin () {
    console.log("login");
  }

  render() {
    return (
        <div>
        {this.props.user ? (
          <div>
            <p>Hi { this.props.user.email } </p>
            <Button onClick={ this.handleLogout }> Logout </Button>
          </div>
        ) : (
          <Button onClick={ this.handleLogin }> Login </Button>
        )}
        </div>
    );
  }
}
