import * as React from "react";

import User from "../models/user";
import Button from "./Button";
import { Icon, ICON } from "./Icon";
import { Menu, MenuItem } from "./Menu";

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
        <Button id="userControl">
          {this.props.user && this.props.user.photoUrl ? (
            <img
              style={{ borderRadius: "50%" }} /** Border Radius provides the circle */
              width="32"
              height="32"
              src={this.props.user.photoUrl}
              />
          ) : (
              <Icon
                width={32}
                height={32}
                icon={ICON.DEFAULT_AVATAR}
                />
            )}
        </Button>
        <Menu align="left" valign="bottom" ripple={true} target="userControl" >
          <MenuItem>
            <Button
              onClick={callback}>
              {buttonText}
            </Button>
          </MenuItem>
        </Menu>
      </div>
    );
  }
}
