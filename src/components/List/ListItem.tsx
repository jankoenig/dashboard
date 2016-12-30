import * as React from "react";

import MDLComponent from "../MDLComponent";

import { ListItem } from "react-toolbox/lib/list";

const ListItemStyle = require("../../themes/listitem.scss");

export interface TwoLineItemProps {
    index: number;
    primaryValue: string;
    secondaryValue: string;
    to?: string;
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
        return (
            <ListItem
                theme={ListItemStyle}
                caption={this.props.primaryValue}
                legend={this.props.secondaryValue}
                to={this.props.to}
                onClick={this.click.bind(this)}
                />
        );
    }
}

export default StaticListItem;