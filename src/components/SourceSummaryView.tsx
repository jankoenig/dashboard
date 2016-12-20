import * as React from "react";
import { VictoryBar, VictoryChart } from "victory";

import { Cell, Grid } from "../components/Grid";
import SourceSummary from "../models/source-summary";

interface SourceSummaryViewProps {
    sourceSummary: SourceSummary;
}

export default class SourceSummaryView extends React.Component<SourceSummaryViewProps, any> {

    render() {

        let summary: JSX.Element;

        // Depending on if there is data available, we display a different message to the user
        if (this.props.sourceSummary) {
            if (this.props.sourceSummary.totalEvents > 0) {
                summary = (
                    <span>
                        <Grid>
                            <Cell col={4}> {this.props.sourceSummary.eventLabel}: {this.props.sourceSummary.totalEvents} </Cell>
                            <Cell col={4}> Crashes: {this.props.sourceSummary.totalCrashes} </Cell>
                            <Cell col={4}> Unique Users: {this.props.sourceSummary.totalUniqueUsers} </Cell>
                        </Grid>
                        <Grid>
                            <Cell col={12}>
                                <VictoryChart scale={{ x: "time", y: "linear" }} height={200} animate={{ duration: 2000 }}>
                                    <VictoryBar data={this.props.sourceSummary.events} x={"timestamp"} y={"events"} />
                                </VictoryChart>
                            </Cell>
                        </Grid>
                    </span>
                );
            } else {
                summary = (<Grid><p> no recent data </p></Grid>);
            }
        } else {
            summary = (<Grid><p>loading data...</p></Grid>);
        }

        return (
            <div>
                <Grid>
                    <h4> Summary </h4>
                </Grid>
                {summary}
            </div>
        );
    }
}
