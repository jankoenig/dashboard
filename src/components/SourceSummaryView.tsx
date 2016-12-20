import * as React from "react";
import { VictoryChart, VictoryGroup, VictoryLine } from "victory";

import { Cell, Grid } from "../components/Grid";
import SourceSummary from "../models/source-summary";

interface SourceSummaryViewProps {
    sourceSummary: SourceSummary;
}

export default class SourceSummaryView extends React.Component<SourceSummaryViewProps, any> {

    render() {
        console.log(this.props.sourceSummary ? this.props.sourceSummary.events : undefined);
        return (
            <div>
                <Grid>
                    <h4> Summary </h4>
                </Grid>
                {this.props.sourceSummary ? (
                    <Grid>
                        <Cell col={4}> Crashes: {this.props.sourceSummary.crashes.length} </Cell>
                        <Cell col={4}>
                            <VictoryChart scale={"time"}>
                                <VictoryGroup>
                                    <VictoryLine data={this.props.sourceSummary.events} x={"timestamp"} />
                                </VictoryGroup>
                            </VictoryChart>
                        </Cell>
                    </Grid>
                ) : (
                    <p> Data not yet available </p>
                    )}
            </div>
        );
    }
}
