import * as React from "react";
import { Cell, Grid } from "./Grid";

import browser from "../utils/browser";

interface Dimensions {
    width: number;
    height: number;
}

export interface Pane {
    pane: JSX.Element;
    cellStyle: React.CSSProperties;
}

export interface TwoPaneProps {
    spacing: boolean;
    leftPane(): Pane;
    rightPane(): Pane;
}

interface TwoPaneState {
    myHeight: number;
}

export class TwoPane extends React.Component<TwoPaneProps, TwoPaneState> {

    static count: number = 0;

    root: Element;
    resizeEvent: browser.WrappedEvent;

    constructor(props: TwoPaneProps) {
        super(props);
        this.state = {
            myHeight: 0
        };
        ++TwoPane.count;
    }

    componentDidMount() {
        this.resizeEvent = browser.onResize(this.updateDimensions.bind(this));
        this.resizeEvent.register();
        this.updateDimensions();
    }

    componentWillUnmount() {
        this.resizeEvent.unregister();
    }

    onRootElement(root: Element) {
        this.root = root;
    }

    updateDimensions() {
        this.state.myHeight = this.getDimensions().height;
        this.setState(this.state);
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
        let leftPane = this.props.leftPane();
        let rightPane = this.props.rightPane();
        let spacing = this.props.spacing !== undefined && this.props.spacing;

        let leftStyle = {...{ height: this.state.myHeight, overflowY: "auto" }, ... leftPane.cellStyle };
        let rightStyle = {...{height: this.state.myHeight, overflowY: "auto" }, ... rightPane.cellStyle };
        return (
            <div ref={this.onRootElement.bind(this)} >
                <Grid
                    noSpacing={spacing}>
                    <Cell col={6} phone={4} tablet={4} style={leftStyle}>
                        {leftPane.pane}
                    </Cell>
                    <Cell col={6} hidePhone={true} tablet={4} style={rightStyle}>
                        {rightPane.pane}
                    </Cell>
                </Grid >
            </div>
        );
    }
}