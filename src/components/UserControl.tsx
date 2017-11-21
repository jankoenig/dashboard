import * as React from "react";

import User from "../models/user";
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

    let icon = this.props.user && this.props.user.photoURL ? (
      <img
        style={{ borderRadius: "50%" }}
        width="32"
        height="32"
        src={this.props.user.photoURL}
        />
    ) : (
        <Icon
          style={{width: "32", height: "32"}}
          icon={ICON.DEFAULT_AVATAR}
          />
      );
    return (
      <Menu
        icon={icon}
        position="topRight"
        menuRipple={true}>
        <MenuItem
          caption={buttonText}
          onClick={callback} />
      </Menu>
    );
  }
}
