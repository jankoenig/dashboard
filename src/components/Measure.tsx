import * as React from "react";

import browser from "../utils/browser";

export interface Dimensions {
    width: number;
    height: number;
}

export interface MeasureProps {
    onMeasure: (newDimens: Dimensions) => void;
}

interface MeasureState { }

export class Measure extends React.Component<MeasureProps, MeasureState> {
    private root: Element;
    private resizeEvent: browser.WrappedEvent;
    private observer: MutationObserver;

    componentDidMount() {
        this.resizeEvent = browser.onResize(this.updateDimensions.bind(this));
        this.resizeEvent.register();
        this.updateDimensions();

        this.observer = browser.onMutation(this.root, this.onMutation.bind(this));
    }

    onMutation(mutations: MutationRecord[], observer: MutationObserver) {
        this.updateDimensions();
    }

    updateDimensions() {
        let dimensions = this.getDimensions();
        this.props.onMeasure(dimensions);
    }

    componentWillUnmount() {
        this.resizeEvent.unregister();
        this.observer.disconnect();
    }

    onRootElement(root: Element) {
        this.root = root;
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
            height = windowDimens.height - heightOffset;

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

    render() {
        return (
            <div ref={this.onRootElement.bind(this)}>
                {this.props.children}
            </div>
        );
    }
}