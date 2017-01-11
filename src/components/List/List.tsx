import * as React from "react";

import { Dimensions, Measure } from "../Measure";

let ReactList = require("react-list");

export interface ListProps {
    itemRenderer: (index: number, key: string) => JSX.Element;
    onSelect?: (index: number) => void;
    onScroll?: (event: React.UIEvent) => void;
    length: number;
    type: string;
}

interface ListState {
    dimens: Dimensions;
}

/**
 * A list that measures out it's own height so it does not stretch beyond the visible area.
 * Items will not render beyond the visible height until the user scrolls to them. This prevents, say,
 * a thousand items being rendered all at once.
 *
 * The ItemRenderer should return a ListItem component.
 */
class StaticList extends React.Component<ListProps, ListState> {

    constructor(props: ListProps) {
        super(props);
        this.state = {
            dimens: undefined
        };

        this.updateDimensions = this.updateDimensions.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
    }

    updateDimensions(dimensions: Dimensions) {
        this.state.dimens = dimensions;
        this.setState(this.state);
    }

    handleScroll(event: React.UIEvent) {
        console.info("SCROLL SCROLL");
        if (this.props.onScroll) {
            this.props.onScroll(event);
        }
    }

    render(): JSX.Element {
        let parentStyle = (this.state.dimens) ? { overflowY: "scroll", height: this.state.dimens.height } : {};

        // This is crazy, but there's a reason for now.
        // "List" is part of the React-Toolbox which provides styling for the list and list items.
        // "ReactList" is an internal element that provides infinite scrolling so that all the elements aren't loaded instantly.
        // They are two separate but similarly name libraries patched together.

        return (
            <Measure
                onMeasure={this.updateDimensions} >
                <div style={parentStyle} onScroll={this.props.onScroll}>
                    <ReactList
                        itemRenderer={this.props.itemRenderer}
                        length={this.props.length}
                        type={this.props.type} />
                </div>
            </Measure>
        );
    }
}

export default StaticList;