import * as React from "react";
import { Cell, Grid } from "./Grid";

import { Dimensions, Measure } from "./Measure";

export interface TwoPaneProps {
    spacing: boolean;
    leftStyle?: React.CSSProperties;
    rightStyle?: React.CSSProperties;
}

interface TwoPaneState {
    myHeight: number;
}

/**
 * A widget that splits two children in half and keeps their sizes stable to the size of this widget. That means that
 * the children will be responsible for their scrolling should the become larger than this widget.
 */
export class TwoPane extends React.Component<TwoPaneProps, TwoPaneState> {

    constructor(props: TwoPaneProps) {
        super(props);
        this.state = {
            myHeight: 0
        };
    }

    onMeasure(dimensions: Dimensions) {
        this.setState({ myHeight: dimensions.height });
    }

    render(): JSX.Element {
        let leftStyleProp: React.CSSProperties = this.props.leftStyle || {};
        let rightStyleProp: React.CSSProperties = this.props.rightStyle || {};
        let spacing = this.props.spacing !== undefined && this.props.spacing;

        const defaultStyle: React.CSSProperties = { height: this.state.myHeight, overflowY: "auto" };
        let leftStyle: React.CSSProperties = { ...defaultStyle, ...leftStyleProp };
        let rightStyle: React.CSSProperties = { ...defaultStyle, ...rightStyleProp };

        let leftObj = (this.props as any).children[0];
        let rightObj = (this.props as any).children[1];

        return (
            <Measure
                onMeasure={this.onMeasure.bind(this)} >
                <Grid
                    noSpacing={spacing}>
                    <Cell col={6} phone={4} tablet={4} style={leftStyle}>
                        {leftObj}
                    </Cell>
                    <Cell col={6} hidePhone={true} tablet={4} style={rightStyle}>
                        {rightObj}
                    </Cell>
                </Grid >
            </Measure>
        );
    }
}

export default TwoPane;