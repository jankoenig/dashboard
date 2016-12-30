import { Component } from "react";
import { Link } from "react-router";

import { MenuItem, MenuItemProps } from "react-toolbox/lib/menu";

const MenuTheme = require("../../themes/menu.scss");

export interface StyledMenuItemProps extends MenuItemProps {
    to?: string;
}

interface StyledMenuItemState {

}

class StyledMenuItem extends Component<StyledMenuItemProps, StyledMenuItemState> {
    render() {
        const {theme, ...others} = this.props;

        const useTheme = theme || MenuTheme;

        console.log(useTheme);

        return (
            <Link to={this.props.to}>
                <MenuItem
                    theme={useTheme}
                    {...others}>
                    {this.props.children}
                </MenuItem>
            </Link>
        );
    }
}

export default StyledMenuItem;