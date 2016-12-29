import * as React from "react";

import MDLComponent from "../MDLComponent";

const rippleFactory = require("../../../node_modules/react-toolbox/lib/ripple/Ripple.js");

export interface TwoLineItemProps {
    index: number;
    primaryValue: string;
    secondaryValue: string;
    onSelected?: (index: number) => void;
}

export interface TwoLineItemState {
}

const factory = (ripple: any) => {
    class TwoLineItem extends MDLComponent<TwoLineItemProps, TwoLineItemState> {

        constructor(props: TwoLineItemProps) {
            super(props);
        }

        click() {
            console.info("CLICK");
            if (this.props.onSelected) {
                this.props.onSelected(this.props.index);
            }
        }

        render() {
            return (
                <div onClick={this.click.bind(this)} style={{ cursor: "pointer", overflow: "hidden", position: "relative" }} className="mdl-list__item mdl-list__item--two-line">
                    <span className="mdl-list__item-primary-content">
                        <span>{this.props.primaryValue}</span>
                        <span className="mdl-list__item-sub-title">{this.props.secondaryValue}</span>
                    </span>
                </div>
            );
        }
    }

    return ripple(TwoLineItem);
};

const TwoLineItem = factory(rippleFactory.default({}));

export default TwoLineItem;