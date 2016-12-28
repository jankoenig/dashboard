// import { Component } from "react";

import MDLComponent from "../MDLComponent";

export interface TwoLineItemProps {
    index: number;
    primaryValue: string;
    secondaryValue: string;
    onSelected?: (index: number) => void;
}

export interface TwoLineItemState {
}

export class TwoLineItem extends MDLComponent<TwoLineItemProps, TwoLineItemState> {

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