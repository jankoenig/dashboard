import * as React from "react";
import browser from "../utils/browser";

let ReactList = require("react-list");

interface Dimensions {
    width: number;
    height: number;
}

export interface ListProps {
    itemRenderer: (index: number, key: string) => JSX.Element;
    length: number;
    type: string;
}

interface ListState {
    dimens: Dimensions;
}

export class List extends React.Component<ListProps, ListState> {

    root: Element;
    resizeEvent: browser.WrappedEvent;

    constructor(props: ListProps) {
        super(props);
        this.state = {
            dimens: undefined
        };
    }

    componentDidMount() {
        this.resizeEvent = browser.onResize(this.updateDimensions.bind(this));
        this.resizeEvent.register();
        this.updateDimensions();
    }

    componentWillUnmount() {
        this.resizeEvent.unregister();
    }

    updateDimensions() {
        this.state.dimens = this.getDimensions();
        this.setState(this.state);
    }

    onRootLayout(element: Element) {
        this.root = element;
    }

    getDimensions(): Dimensions {
        // Algorithm taken from https://andylangton.co.uk/blog/development/get-viewportwindow-size-width-and-height-javascript
        // Modified to get around unit tests which don't have half this.
        let width: number, height: number, heightOffset: number;
        if (window) {
            let windowDimens = browser.size();
            let rect = this.root.getBoundingClientRect();

            heightOffset = rect.top;
            width = windowDimens.width;
            height = rect.bottom;

            console.info(windowDimens);
            console.info(rect);
        } else {
            // Unit tests
            width = 200;
            height = 200;
            heightOffset = 0;
        }
        let obj: Dimensions = {
            width: width,
            height: height
        };

        return obj;
    }

    render(): JSX.Element {
        let parentStyle = ( this.state.dimens ) ? { overflowY: "scroll", height: this.state.dimens.height } : {};
        return (
            <div ref={this.onRootLayout.bind(this)} style={parentStyle}>
                <ReactList
                    itemRenderer={this.props.itemRenderer}
                    length={this.props.length}
                    type={this.props.type} />
            </div>
        );
    }
}