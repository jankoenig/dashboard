import * as React from "react";
import { Link } from "react-router";

import { ListItem } from "react-toolbox/lib/list";

import MDLComponent from "../MDLComponent";

const ListItemStyle = require("../../themes/listitem.scss");

export interface TwoLineItemProps {
    /**
     * Number that this item is in.
     */
    index: number;
    /**
     * The primary text to appear on the item.
     */
    primaryValue: string;
    /**
     * The secondary text to appear on the item.
     */
    secondaryValue: string;
    /**
     * A route to method that will use `react-router` to move to another part of the website.
     */
    routeTo?: string;
    /**
     * A hard linke href that can be used to go to another website.
     */
    linkTo?: string;
    /**
     * A callback to retrieve a selected item index.
     */
    onSelected?: (index: number) => void;
}

export interface TwoLineItemState {
}

class StaticListItem extends MDLComponent<TwoLineItemProps, TwoLineItemState> {

    constructor(props: TwoLineItemProps) {
        super(props);
    }

    click() {
        if (this.props.onSelected) {
            this.props.onSelected(this.props.index);
        }
    }

    render() {
        console.log(ListItemStyle);
        return (
            <Link style={{ textDecoration: "none" }} to={this.props.routeTo}>
                <ListItem
                    theme={ListItemStyle}
                    caption={this.props.primaryValue}
                    legend={this.props.secondaryValue}
                    to={this.props.linkTo}
                    onClick={this.click.bind(this)}
                    />
            </Link>
        );
    }
}

export default StaticListItem;