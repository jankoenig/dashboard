import * as React from "react";

import User from "../models/user";
import { Icon, ICON } from "./Icon";
import { Menu, MenuItem } from "./Menu";

interface UserControlProps {
  user?: User;
  login: () => void;
  logout: () => void;
  goTo: (path: string) => void;
}

export default class UserControl extends React.Component<UserControlProps, any> {

  render() {

    let logout = this.props.user ? this.props.logout : this.props.login;
    let buttonText = this.props.user ? "Logout" : "Login";

    let goToSettings = () => {
      this.props.goTo("/settings");
    };

    let icon = this.props.user && this.props.user.photoUrl ? (
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
      );
    return (
      <Menu
        icon={icon}
        position="topRight"
        menuRipple >
        {this.props.user ? (
          <MenuItem
            caption={"Settings"}
            onClick={goToSettings} />
        ) : undefined}
        <MenuItem
          caption={buttonText}
          onClick={logout} />
      </Menu>
    );
  }
}
