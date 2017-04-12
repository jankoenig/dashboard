import * as React from "react";

import { MenuItem, MenuItemProps } from "react-toolbox/lib/menu";

const MenuTheme = require("../../themes/menu.scss");

export interface StyledMenuItemProps extends MenuItemProps {
    to?: string;
}

interface StyledMenuItemState {

}

class StyledMenuItem extends React.Component<StyledMenuItemProps, StyledMenuItemState> {
    render() {
        const {theme, ...others} = this.props;

        const useTheme = {... MenuTheme, ... theme};

        return (
            <a href={this.props.to}>
                <MenuItem
                    theme={useTheme}
                    {...others}>
                    {this.props.children}
                </MenuItem>
            </a>
        );
    }
}

export { StyledMenuItem as MenuItem };
export default StyledMenuItem;