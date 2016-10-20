import * as React from "react";

/**
 * A MenuItem for the Menu component.
 *
 * Example usage:
 *
 * <Menu>
 *   <MenuItem>Item 1 </MenuItem>
 * </Menu>
 */
export default class MenuItem extends React.Component<any, any> {
    render() {
        return (
            <li className="mdl-menu__item">
                {this.props.children}
            </li>
        );
    }
}