import * as React from "react";
import { Cell, Grid } from "./Grid";

import { Dimensions, Measure } from "./Measure";

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

    constructor(props: TwoPaneProps) {
        super(props);
        this.state = {
            myHeight: 0
        };
    }

    onMeasure(dimensions: Dimensions) {
        this.state.myHeight = dimensions.height;
        this.setState(this.state);
    }

    render(): JSX.Element {
        let leftPane = this.props.leftPane();
        let rightPane = this.props.rightPane();
        let spacing = this.props.spacing !== undefined && this.props.spacing;

        let leftStyle = {...{ height: this.state.myHeight, overflowY: "auto" }, ... leftPane.cellStyle };
        let rightStyle = {...{height: this.state.myHeight, overflowY: "auto" }, ... rightPane.cellStyle };
        return (
            <Measure
                onMeasure={this.onMeasure.bind(this)} >
                <Grid
                    noSpacing={spacing}>
                    <Cell col={6} phone={4} tablet={4} style={leftStyle}>
                        {leftPane.pane}
                    </Cell>
                    <Cell col={6} hidePhone={true} tablet={4} style={rightStyle}>
                        {rightPane.pane}
                    </Cell>
                </Grid >
            </Measure>
        );
    }
}