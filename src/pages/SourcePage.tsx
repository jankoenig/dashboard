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

import Query, { EndTimeParameter, SortParameter, SourceParameter, StartTimeParameter } from "../models/query";
import LogService from "../services/log";

enum DataState {
    LOADING, ERROR, LOADED
}

interface SourcePageProps {
    source: Source;
}

interface SourcePageState {
    timeSummaryData: TimeData[];
    intentSummaryData: CountData[];
    sourceStats: LogService.SourceStats;
    timeLoaded: DataState;
    intentLoaded: DataState;
    statsLoaded: DataState;
}

function mapStateToProps(state: State.All) {
    return {
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
            timeSummaryData: defaultTimeData(daysAgo(7), daysAgo(0)),
            intentSummaryData: defaultIntentData(),
            timeLoaded: DataState.LOADING,
            intentLoaded: DataState.LOADING,
            statsLoaded: DataState.LOADING,
            sourceStats: {
                source: "",
                stats: {
                    totalEvents: 0,
                    totalExceptions: 0,
                    totalUsers: 0
                }
            }
        };
    }

    componentWillReceiveProps(nextProps: SourcePageProps, context: any) {
        if (!this.props.source || this.props.source.id !== this.props.source.id) {
            this.retrieveTimeSummary(nextProps.source);
            this.retrieveIntentSummary(nextProps.source);
            this.retrieveSourceStats(nextProps.source);
        }
    }

    retrieveTimeSummary(source: Source) {
        const dataLoader: DataLoader<LogService.TimeSummary, TimeData[]> = {
            loadData: function (query: Query): Promise<LogService.TimeSummary> {
                return LogService.getTimeSummary(query);
            },
            map: function (data: LogService.TimeSummary): TimeData[] {
                return data.buckets.map(function (value: LogService.TimeBucket, index: number, array: LogService.TimeBucket[]) {
                    let timeData: TimeData = {
                        time: value.date,
                        count: value.count
                    };
                    return timeData;
                });
            },
        };

        const callback: GenericStateHandler<TimeData[]> = new GenericStateHandler(this.state, "timeLoaded", "timeSummaryData", this.setState.bind(this));
        const onLoaded = callback.onLoaded.bind(callback);
        callback.onLoaded = function(data: TimeData[]) {
            if (data.length === 0) {
                data = defaultTimeData(daysAgo(7), daysAgo(0));
            }
            onLoaded(data);
        };
        const loader: Loader = new Loader(dataLoader, callback, callback);

        const query: Query = new Query();
        query.add(new SourceParameter(source));
        query.add(new StartTimeParameter(daysAgo(7)));
        query.add(new EndTimeParameter(daysAgo(0)));
        query.add(new TimeSortParameter("asc"));

        loader.load(query);
    }

    retrieveIntentSummary(source: Source) {
        const dataLoader: DataLoader<LogService.IntentSummary, CountData[]> = {
            loadData: function (query: Query): Promise<LogService.IntentSummary> {
                return LogService.getIntentSummary(query);
            },
            map: function (data: LogService.IntentSummary): CountData[] {
                return data.count
                    .map(function (value: LogService.IntentBucket, index: number, array: LogService.IntentBucket[]) {
                        let intentData: CountData = {
                            count: value.count,
                            title: value.name
                        };
                        return intentData;
                    });
            }
        };

        const callback: GenericStateHandler<TimeData> = new GenericStateHandler(this.state, "intentLoaded", "intentSummaryData", this.setState.bind(this));
        const loader: Loader = new Loader(dataLoader, callback, callback);

        const query: Query = new Query();
        query.add(new SourceParameter(source));
        query.add(new StartTimeParameter(daysAgo(7)));
        query.add(new EndTimeParameter(daysAgo(0)));
        query.add(new IntentSortParameter("desc"));

        loader.load(query);
    }

    retrieveSourceStats(source: Source) {
        const dataLoader: DataLoader<LogService.SourceStats, LogService.SourceStats> = {
            loadData: function (query: Query): Promise<LogService.SourceStats> {
                return LogService.getSourceSummary(query);
            },
            map: function (data: LogService.SourceStats): LogService.SourceStats {
                return data;
            }
        };

        const callback: GenericStateHandler<TimeData> = new GenericStateHandler(this.state, "statsLoaded", "sourceStats", this.setState.bind(this));
        const loader: Loader = new Loader(dataLoader, callback, callback);

        const query: Query = new Query();
        query.add(new SourceParameter(source));
        query.add(new StartTimeParameter(daysAgo(7)));
        query.add(new EndTimeParameter(daysAgo(0)));

        loader.load(query);
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
                    totalEvents={this.state.sourceStats.stats.totalEvents}
                    totalUniqueUsers={this.state.sourceStats.stats.totalUsers}
                    totalExceptions={this.state.sourceStats.stats.totalExceptions}
                    timeLoaded={this.state.timeLoaded}
                    intentLoaded={this.state.intentLoaded}
                    statsLoaded={this.state.statsLoaded} />
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
    totalEvents: number;
    totalUniqueUsers: number;
    totalExceptions: number;
    timeLoaded: DataState;
    intentLoaded: DataState;
    statsLoaded: DataState;
}

interface SummaryDataState {
    eventsLabel: string;
    usersLabel: string;
    errorsLabel: string;
}

class SummaryView extends React.Component<SummaryViewProps, SummaryDataState> {

    constructor(props: SummaryViewProps) {
        super(props);
        this.state = {
            eventsLabel: "",
            usersLabel: "",
            errorsLabel: ""
        };
        this.setLabels(props, this.state);
    }

    componentWillReceiveProps(nextProps: SummaryViewProps, context: any) {
        this.setLabels(nextProps, this.state);
        this.setState(this.state);
    }

    setLabels(props: SummaryViewProps, state: SummaryDataState) {
        if (props.statsLoaded === DataState.LOADING) {
            this.state = {
                eventsLabel: "Loading...",
                usersLabel: "Loading...",
                errorsLabel: "Loading..."
            };
        } else if (props.statsLoaded === DataState.ERROR) {
            this.state = {
                eventsLabel: "N/A",
                usersLabel: "N/A",
                errorsLabel: "N/A"
            };
        } else {
            this.state = {
                eventsLabel: props.totalEvents.toString(),
                usersLabel: props.totalUniqueUsers.toString(),
                errorsLabel: props.totalExceptions.toString()
            };
        }
    }

    render() {
        let summary: JSX.Element;
        summary = (
            <span>
                <Grid>
                    <Cell col={4}>
                        <DataTile
                            value={this.state.eventsLabel}
                            label={"Total Events"} />
                    </Cell>
                    <Cell col={4}>
                        <DataTile
                            value={this.state.usersLabel}
                            label={"Unique Users"} />
                    </Cell>
                    <Cell col={4}>
                        <DataTile
                            value={this.state.errorsLabel}
                            label={"Total Errors"} />
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

function defaultTimeData(start: Date, end: Date): TimeData[] {
    let data: TimeData[] = [];
    let currentDate: Date = new Date(start);
    while (currentDate.getDate() < end.getDate()) {
        data.push({
            time: currentDate.toISOString()
        });
        currentDate.setDate(currentDate.getDate() + 1);
    }
    return data;
}

function daysAgo(days: number) {
    const date: Date = new Date();
    date.setDate(date.getDate() - days);
    return date;
}

function defaultIntentData(): CountData[] {
    const data: CountData[] = [];
    return data;
}

interface DataLoader<ServerData, ClientData> {
    loadData: (query: Query) => Promise<ServerData>;
    map: (data: ServerData) => ClientData;
}

interface LoadCallback<ClientData> {
    onLoaded: (data: ClientData) => void;
    onError: (err: Error) => void;
}

interface StateHandler {
    stateChange: (state: DataState) => void;
}

class GenericStateHandler<Data> implements StateHandler, LoadCallback<Data> {
    readonly dataStateVariable: string;
    readonly dataVariable: string;
    readonly setState: (state: any) => void;
    state: any;

    constructor(state: any, dataStateVarable: string, dataVariable: string, setState: (state: any) => void) {
        this.dataVariable = dataVariable;
        this.dataStateVariable = dataStateVarable;
        this.state = state;
        this.setState = setState;
    }

    stateChange(state: DataState) {
        this.state[this.dataStateVariable] = state;
        this.setState(this.state);
    }

    onLoaded(data: Data) {
        this.state[this.dataVariable] = data;
        this.setState(this.state);
    }

    onError(err: Error) {
        // Error is caught in the state change. Nothing we need to do.
    }
}

class Loader {
    dataLoader: DataLoader<any, any>;
    stateHandler: StateHandler;
    loadCallback: LoadCallback<any>;

    constructor(dataLoader: DataLoader<any, any>, stateHandler: StateHandler, loadCallback: LoadCallback<any>) {
        this.dataLoader = dataLoader;
        this.stateHandler = stateHandler;
        this.loadCallback = loadCallback;
    }

    load(query: Query) {
        this.stateHandler.stateChange(DataState.LOADED);
        this.dataLoader.loadData(query).then((value: any) => {
            const loadedData: any = this.dataLoader.map(value);
            this.stateHandler.stateChange(DataState.LOADED);
            this.loadCallback.onLoaded(loadedData);
        }).catch((err: Error) => {
            this.stateHandler.stateChange(DataState.ERROR);
            this.loadCallback.onError(err);
        });
    }
}