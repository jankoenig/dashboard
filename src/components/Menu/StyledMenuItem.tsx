import { Component } from "react";

import { MenuItem, MenuItemProps } from "react-toolbox/lib/menu";

const MenuTheme = require("../../themes/menu.scss");

export interface StyledMenuItemProps extends MenuItemProps {
}

interface StyledMenuItemState {

}

class StyledMenuItem extends Component<StyledMenuItemProps, StyledMenuItemState> {
    render() {
        const {theme, ...others} = this.props;

        const useTheme = theme || MenuTheme;

        console.log(useTheme);

        return (
            <MenuItem
                theme={useTheme}
                {... others}>
                {this.props.children}
            </MenuItem>
        );
    }
}

export default StyledMenuItem;