import * as React from "react";
import { Cell, Grid } from "./Grid";

export interface Pane {
    pane: JSX.Element;
    cellStyle: any;
}

export interface TwoPaneProps {
    spacing: boolean;
    leftPane(): Pane;
    rightPane(): Pane;
}

interface TwoPaneState {

}

export class TwoPane extends React.Component<TwoPaneProps, TwoPaneState> {

    render(): JSX.Element {
        let leftPane = this.props.leftPane();
        let rightPane = this.props.rightPane();
        let spacing = this.props.spacing !== undefined && this.props.spacing;
        return (
            <Grid
                noSpacing={spacing}>
                <Cell col={6} phone={4} tablet={4} style={leftPane.cellStyle}>
                    {leftPane.pane}
                </Cell>
                <Cell col={6} hidePhone={true} tablet={4} style={rightPane.cellStyle}>
                    {rightPane.pane}
                </Cell>
            </Grid >
        );
    }
}