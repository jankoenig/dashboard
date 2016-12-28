// import { Component } from "react";

import MDLComponent from "../MDLComponent";

export interface TwoLineItemProps {
    primaryValue: string;
    secondaryValue: string;
}

export interface TwoLineItemState {
}

export class TwoLineItem extends MDLComponent<TwoLineItemProps, TwoLineItemState> {

    constructor(props: TwoLineItemProps) {
        super(props);
    }

    click() {
    }

    render() {
        return (
            <div className="mdl-list">
                <div style={{ cursor: "pointer", overflow: "hidden", position: "relative" }} className="mdl-list__item mdl-list__item--two-line mdl-js-ripple-effect">
                    <span className="mdl-ripple" />
                    <span className="mdl-list__item-primary-content">
                        <span>{this.props.primaryValue}</span>
                        <span className="mdl-list__item-sub-title">{this.props.secondaryValue}</span>
                    </span>
                </div>
            </div>
        );
    }
}