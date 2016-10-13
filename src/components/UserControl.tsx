import * as React from "react";

import Button from "../components/Button";
import User from "../models/User";

interface UserProps {
    user?: User;
    login: () => void;
    logout: () => void;
}

export default class UserControl extends React.Component<UserProps, any> {
  constructor(props: any) {
    super(props);
  }

  render() {
    return (
        <div>
        {this.props.user ? (
          <div>
            <p>Hi { this.props.user.email } </p>
            <Button onClick={ this.props.logout }> Logout </Button>
          </div>
        ) : (
          <Button onClick={ this.props.login }> Login </Button>
        )}
        </div>
    );
  }
}
