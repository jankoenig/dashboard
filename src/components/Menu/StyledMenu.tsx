import { Component } from "react";

import { IconMenu, IconMenuProps } from "react-toolbox/lib/menu";

const MenuTheme = require("../../themes/menu.scss");

export interface StyledMenuProps extends IconMenuProps {
}

interface StyledMenuState {

}

/**
 * This exists to re-use the consistent theme around the list.
 */
class StyledMenu extends Component<StyledMenuProps, StyledMenuState> {
    render() {
        const {theme, ...others} = this.props;

        const useTheme = {... MenuTheme, ... theme};

        console.log(useTheme);

        return (
            <IconMenu
                theme={useTheme}
                {...others}>
                {this.props.children}
            </IconMenu>
        );
    }
}

export { StyledMenu as Menu };
export default StyledMenu;