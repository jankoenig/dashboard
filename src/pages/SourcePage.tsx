import * as moment from "moment";
import * as React from "react";
import { connect } from "react-redux";
import { Link } from "react-router";
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import Button from "../components/Button";
import DataTile from "../components/DataTile";
import { Cell, Grid } from "../components/Grid";
import Source from "../models/source";
import { State } from "../reducers";
import { LogMap } from "../reducers/log";

import Query, { SortParameter, SourceParameter } from "../models/query";
import LogService from "../services/log";

interface SourcePageProps {
    source: Source;
    logMap: LogMap;
}

interface SourcePageState {
    timeSummaryData: TimeData[];
    intentSummaryData: IntentCountData[];
}

function mapStateToProps(state: State.All) {
    return {
        logMap: state.log.logMap,
        source: state.source.currentSource
    };
}

function mapDispatchToProps(dispatch: Redux.Dispatch<any>) {
    return {
    };
}

class TimeSortParameter extends SortParameter {
    parameter = "date_sort";
}

class IntentSortParameter extends SortParameter {
    parameter = "count_sort";
}

export class SourcePage extends React.Component<SourcePageProps, SourcePageState> {

    constructor(props: SourcePageProps) {
        super(props);
        this.state = {
            timeSummaryData: [],
            intentSummaryData: []
        };
    }

    componentWillReceiveProps(nextProps: SourcePageProps, context: any) {
        this.retrieveTimeSummary(nextProps.source);
        this.retrieveIntentSummary(nextProps.source);
    }

    retrieveTimeSummary(source: Source) {
        const query: Query = new Query();
        query.add(new SourceParameter(source));
        query.add(new TimeSortParameter("asc"));

        LogService.getTimeSummary(query)
            .then((summary: LogService.TimeSummary) => {
                this.state.timeSummaryData = summary.buckets
                    .map(function(value: LogService.TimeBucket, index: number, array: LogService.TimeBucket[]) {
                        let timeData: TimeData = {
                            time: value.date,
                            value: value.count
                        };
                        return timeData;
                });
                this.setState(this.state);
            });
    }

    retrieveIntentSummary(source: Source) {
        const query: Query = new Query();
        query.add(new SourceParameter(source));
        query.add(new IntentSortParameter("desc"));

        LogService.getIntentSummary(query)
            .then((summary: LogService.IntentSummary) => {
                this.state.intentSummaryData = summary.count
                    .map(function(value: LogService.IntentBucket, index: number, array: LogService.IntentBucket[]) {
                        let intentData: IntentCountData = {
                            count: value.count,
                            intent: value.name
                        };
                        return intentData;
                    });
                this.setState(this.state);
            });
    }

    render() {
        return (
            <span>
                {this.props.source ? (
                    <span>
                        <Grid style={{ backgroundColor: "rgb(36, 48, 54)", paddingBottom: "0px", paddingTop: "0px" }}>
                            <Cell col={3} hidePhone={true}>
                                <DataTile
                                    theme={{ inputTextColor: "#ECEFF1" }}
                                    value={this.props.source.name}
                                    label={"Name"} />
                            </Cell>
                            <Cell col={3} hidePhone={true} >
                                <DataTile
                                    theme={{ inputTextColor: "#ECEFF1" }}
                                    value={this.props.source.id}
                                    label={"ID"} />
                            </Cell>
                            <Cell col={3} hidePhone={true} >
                                <DataTile
                                    theme={{ inputTextColor: "#ECEFF1" }}
                                    value={moment(this.props.source.created).format("MMM Do, YYYY")}
                                    label={"Created"} />
                            </Cell>
                            <Cell col={3} hidePhone={true} >
                                <DataTile
                                    theme={{ inputTextColor: "#ECEFF1" }}
                                    value={this.props.source.secretKey}
                                    label={"Secret Key"}
                                    hidden={true}
                                    showable={true} />
                            </Cell>
                        </Grid>
                        <Grid>
                            <Cell col={3}>
                                <p style={{ fontSize: "16px", fontFamily: "Roboto, Helvetica" }}>What would you like to do? </p>
                            </Cell>
                            <Cell col={3}>
                                <Link to={"/skills/" + this.props.source.id + "/logs"}>
                                    <Button raised={true} ripple={true}>View Logs</Button>
                                </Link>
                            </Cell>
                        </Grid>
                    </span>
                ) : undefined}
                <SummaryView
                    timeData={this.state.timeSummaryData}
                    intentData={this.state.intentSummaryData}
                    eventLabel="Event"
                    totalEvents={0}
                    totalUniqueUsers={0}
                    totalExceptions={0} />
            </span>
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SourcePage);

interface TimeData {
    time: string;
    value: number;
}

interface TimeChartProps {
    data: TimeData[];
}

interface TimeChartState {
}

class TimeChart extends React.Component<TimeChartProps, TimeChartState> {

    constructor(props: TimeChartProps) {
        super(props);
    }

    tickFormat(time: string): string {
        return moment(time).format("MM/DD");
    }

    labelFormat(time: string): string {
        return moment(time).format("MM/DD h:mm A");
    }

    render() {
        console.log(this.props);
        return (
            <ResponsiveContainer>
                <LineChart data={this.props.data} >
                    <XAxis dataKey="time" tickFormatter={this.tickFormat} />
                    <YAxis />
                    <Tooltip labelFormatter={this.labelFormat} />
                    <Line type="monotone" dataKey="value" dot={false} />
                </LineChart>
            </ResponsiveContainer>
        );
    }
}

interface IntentCountData {
    intent: string;
    count: number;
}

interface IntentCountChartProps {
    data: IntentCountData[];
}

interface IntentCountChartState {

}

class IntentCountChart extends React.Component<IntentCountChartProps, IntentCountChartState> {

    render() {
        return (
            <ResponsiveContainer>
                <BarChart
                    layout="vertical"
                    data={this.props.data}
                    margin={{ left: 200 }}
                    barSize={30}
                    barCategoryGap={80}>
                    <XAxis type="number" orientation="top" />
                    <YAxis type="category" dataKey="intent" />
                    <Tooltip />
                    <Bar dataKey="count" fill="rgb(49, 130, 189)" />
                </BarChart>
            </ResponsiveContainer>
        );
    }
}

interface SummaryHeaderProps {
    eventLabel: string;
    totalEvents: number;
    totalUniqueUsers: number;
    totalExceptions: number;
}

interface SummaryHeaderState {

}

class SummaryHeader extends React.Component<SummaryHeaderProps, SummaryHeaderState> {
    render() {
        return (
            <Grid>
                <Cell col={4}>
                    <DataTile
                        value={this.props.totalEvents.toString()}
                        label={this.props.eventLabel} />
                </Cell>
                <Cell col={4}>
                    <DataTile
                        value={this.props.totalUniqueUsers.toString()}
                        label={"Unique Users"} />
                </Cell>
                <Cell col={4}>
                    <DataTile
                        value={this.props.totalExceptions.toString()}
                        label={"Exceptions"} />
                </Cell>
            </Grid>
        );
    }
}

interface SummaryViewProps {
    timeData: TimeData[];
    intentData: IntentCountData[];
    eventLabel: string;
    totalEvents: number;
    totalUniqueUsers: number;
    totalExceptions: number;
}

interface SummaryDataState {

}

class SummaryView extends React.Component<SummaryViewProps, SummaryDataState> {

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
        // if (this.props.totalEvents > 0) {
            summary = (
                <span>
                    <Grid>
                        <SummaryHeader
                            eventLabel={this.props.eventLabel}
                            totalEvents={this.props.totalEvents}
                            totalUniqueUsers={this.props.totalUniqueUsers}
                            totalExceptions={this.props.totalExceptions} />
                    </Grid>
                    <Grid>
                        <Cell col={12} style={{ height: 300 }}>
                            <TimeChart
                                data={this.props.timeData} />
                        </Cell>
                    </Grid>
                    <Grid>
                        <Cell col={12} style={{ height: (this.props.intentData.length * 40) + 100 }} >
                            <IntentCountChart
                                data={this.props.intentData} />
                        </Cell>
                    </Grid>
                </span>
            );
        // } else {
        //     summary = (<Grid><p> no recent data </p></Grid>);
        // }

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