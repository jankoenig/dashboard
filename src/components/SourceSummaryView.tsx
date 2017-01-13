import * as moment from "moment";
import * as React from "react";
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import DataTile from "../components/DataTile";
import { Cell, Grid } from "../components/Grid";
import SourceSummary from "../models/source-summary";
import DataUtil from "../utils/data";

interface SourceSummaryViewProps {
    sourceSummary: SourceSummary;
}

export default class SourceSummaryView extends React.Component<SourceSummaryViewProps, any> {

    tickFormat(time: number): string {
        return moment(time).format("MM/DD");
    }

    labelFormat(time: number): string {
        return moment(time).format("MM/DD h:mm A");
    }

    render() {

        let summary: JSX.Element;

        // Depending on if there is data available, we display a different message to the user
        // Graph help from help from http://jsfiddle.net/1vzc18qt/ &
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
                                    value={this.props.sourceSummary.totalExceptions.toString()}
                                    label={"Exceptions"} />
                            </Cell>
                        </Grid>
                        <Grid>
                            <Cell col={12} style={{ height: 300 }}>
                                <ResponsiveContainer>
                                    <LineChart data={this.props.sourceSummary.events} >
                                        <XAxis dataKey="time" tickFormatter={this.tickFormat} ticks={DataUtil.getDayTicks(this.props.sourceSummary.events)} />
                                        <YAxis />
                                        <Tooltip labelFormatter={this.labelFormat} />
                                        <Line dataKey="length" dot={false} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </Cell>
                        </Grid>
                        <Grid>
                            <Cell col={12} style={{ height: (this.props.sourceSummary.requests.length * 40) + 100 }} >
                                <ResponsiveContainer>
                                    <BarChart
                                        layout="vertical"
                                        data={this.props.sourceSummary.requests}
                                        margin={{ left: 200 }}
                                        barSize={30}
                                        barCategoryGap={80}>
                                        <XAxis type="number" orientation="top" />
                                        <YAxis type="category" dataKey="name" />
                                        <Tooltip />
                                        <Bar dataKey="total" fill="rgb(49, 130, 189)" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Cell>
                        </Grid>
                        <Grid>
                            <Cell col={12} style={{ height: 500 }} >
                                <ResponsiveContainer>
                                    <BarChart
                                        data={this.props.sourceSummary.sessions}
                                        margin={{  }}>
                                        <XAxis type="category" dataKey="name"/>
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="total" fill="rgb(49, 130, 189)" />
                                    </BarChart>
                                </ResponsiveContainer>
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
