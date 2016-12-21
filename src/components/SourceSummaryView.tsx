import * as React from "react";
import { VictoryChart, VictoryLine } from "victory";

import DataTile from "../components/DataTile";
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
                            <Cell col={4}>
                                <DataTile
                                    value={this.props.sourceSummary.totalEvents.toString()}
                                    label={this.props.sourceSummary.eventLabel} />
                            </Cell>
                            <Cell col={4}>
                                <DataTile
                                    value={this.props.sourceSummary.totalUniqueUsers.toString()}
                                    label={"Unique Users"} />
                            </Cell>
                            <Cell col={4}>
                                <DataTile
                                    value={this.props.sourceSummary.totalCrashes.toString()}
                                    label={"Crashes"} />
                            </Cell>
                        </Grid>
                        <Grid>
                            <Cell col={12}>
                                <VictoryChart
                                    scale={{ x: "time", y: "linear" }}
                                    height={200}
                                    animate={{ duration: 500 }}>
                                    <VictoryLine
                                        data={this.props.sourceSummary.events}
                                        x={"timestamp"}
                                        y={"events"} />
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
                    <h4> Last Seven Day Summary </h4>
                </Grid>
                {summary}
            </div>
        );
    }
}
