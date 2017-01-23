import * as moment from "moment";
import * as React from "react";
import { connect } from "react-redux";
import { Link } from "react-router";

import Button from "../components/Button";
import DataTile from "../components/DataTile";
import BarChart, { CountData } from "../components/Graphs/Bar/CountChart";
import TimeChart, { TimeData } from "../components/Graphs/Line/TimeChart";
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
    intentSummaryData: CountData[];
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
        if (!this.props.source || this.props.source.id !== this.props.source.id ) {
            this.retrieveTimeSummary(nextProps.source);
            this.retrieveIntentSummary(nextProps.source);
        }
    }

    retrieveTimeSummary(source: Source) {
        const query: Query = new Query();
        query.add(new SourceParameter(source));
        query.add(new TimeSortParameter("asc"));

        console.time("timeQuery");
        LogService.getTimeSummary(query)
            .then((summary: LogService.TimeSummary) => {
                console.timeEnd("timeQuery");
                this.state.timeSummaryData = summary.buckets
                    .map(function (value: LogService.TimeBucket, index: number, array: LogService.TimeBucket[]) {
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

        console.time("intentQuery");
        LogService.getIntentSummary(query)
            .then((summary: LogService.IntentSummary) => {
                console.timeEnd("intentQuery");
                this.state.intentSummaryData = summary.count
                    .map(function (value: LogService.IntentBucket, index: number, array: LogService.IntentBucket[]) {
                        let intentData: CountData = {
                            count: value.count,
                            title: value.name
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

interface SummaryViewProps {
    timeData: TimeData[];
    intentData: CountData[];
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
                <Grid>
                    <Cell col={12} style={{ height: 300 }}>
                        <TimeChart
                            data={this.props.timeData} />
                    </Cell>
                </Grid>
                <Grid>
                    <Cell col={12} style={{ height: (this.props.intentData.length * 40) + 100 }} >
                        <BarChart
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