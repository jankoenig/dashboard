import * as React from "react";
import { VictoryBar, VictoryChart } from "victory";

import FormInput from "../components/FormInput";
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
                                <FormInput
                                    type={"text"}
                                    value={this.props.sourceSummary.totalEvents.toString()}
                                    label={this.props.sourceSummary.eventLabel}
                                    floatingLabel={true}
                                    autoComplete={"off"}
                                    readOnly={true} />
                            </Cell>
                            <Cell col={4}>
                                <FormInput
                                    type={"text"}
                                    value={this.props.sourceSummary.totalUniqueUsers.toString()}
                                    label={"Unique Users"}
                                    floatingLabel={true}
                                    autoComplete={"off"}
                                    readOnly={true} />
                            </Cell>
                            <Cell col={4}>
                                <FormInput
                                    type={"text"}
                                    value={this.props.sourceSummary.totalCrashes.toString()}
                                    label={"Crashes"}
                                    floatingLabel={true}
                                    autoComplete={"off"}
                                    readOnly={true} />
                            </Cell>
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
                    <h4> Last Seven Day Summary </h4>
                </Grid>
                {summary}
            </div>
        );
    }
}
