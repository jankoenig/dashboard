import * as moment from "moment";
import * as React from "react";

import DataTile from "../../components/DataTile";
import { Cell, Grid } from "../../components/Grid";
import Query, { EndTimeParameter, SourceParameter, StartTimeParameter } from "../../models/query";
import Source from "../../models/source";
import LogService from "../../services/log";
import SourceUtils from "../../utils/Source";
import { DataLoader, DataState, GenericStateHandler, Loader } from "./DataLoader";

const DEFAULT_VALUE: string = "N/A";
const LOADING_VALUE: string = "Loading...";

type ENTRY = "stats" | "Amazon.Alexa" | "Google.Home" | "Unknown";

interface Labels {
    eventsLabel: string;
    usersLabel: string;
    errorsLabel: string;
}

interface SourceStatsProps {
    source: Source;
    startDate: moment.Moment;
    endDate: moment.Moment;
    selectedEntries?: ENTRY | ENTRY[];
}

interface SourceStatsState {
    sourceStats: LogService.SourceStats;
    statsLoaded: DataState;
}

function newStats(users: number = 0, exceptions: number = 0, events: number = 0): LogService.TotalStat {
    return {
        totalUsers: 0,
        totalExceptions: 0,
        totalEvents: 0
    };
}

function addStats(stats: LogService.TotalStat[]): LogService.TotalStat {
    let addedStats = newStats();
    for (let stat of stats) {
        addedStats.totalEvents += stat.totalEvents;
        addedStats.totalExceptions += stat.totalExceptions;
        addedStats.totalUsers += stat.totalUsers;
    }
    return addedStats;
}

export class SourceStats extends React.Component<SourceStatsProps, SourceStatsState> {

    static defaultProps: SourceStatsProps = {
        source: undefined,
        startDate: moment().subtract(7, "days"),
        endDate: moment(),
        selectedEntries: ["stats"]
    };

    constructor(props: SourceStatsProps) {
        super(props);

        this.setState = this.setState.bind(this);
        this.state = {
            statsLoaded: DataState.LOADING,
            sourceStats: {
                source: DEFAULT_VALUE,
                stats: newStats(),
                "Amazon.Alexa": newStats(),
                "Google.Home": newStats(),
                Unknown: newStats()
            }
        };
    }

    componentWillReceiveProps(nextProps: SourceStatsProps, context: any) {
        if (nextProps.source) {
            if (!SourceUtils.equals(nextProps.source, this.props.source) || !nextProps.startDate.isSame(this.props.startDate) || !nextProps.endDate.isSame(this.props.endDate)) {
                this.retrieveSourceStats(nextProps.source, nextProps.startDate, nextProps.endDate);
            }
        } else {
            this.setState({
                statsLoaded: DataState.LOADED,
                sourceStats: {
                    source: DEFAULT_VALUE,
                    stats: newStats(),
                    "Amazon.Alexa": newStats(),
                    "Google.Home": newStats(),
                    Unknown: newStats()
                }
            });
        }
    }

    componentWillMount() {
        if (this.props.source) {
            this.retrieveSourceStats(this.props.source, this.props.startDate, this.props.endDate);
        } else {
            this.setState({
                statsLoaded: DataState.LOADED,
                sourceStats: {
                    source: DEFAULT_VALUE,
                    stats: newStats(),
                    "Amazon.Alexa": newStats(),
                    "Google.Home": newStats(),
                    Unknown: newStats()
                }
            });
        }
    }

    static getLabel(sourceStats: LogService.SourceStats, state: DataState, entries: ENTRY | ENTRY[]): Labels {
        if (state === DataState.LOADING) {
            return {
                eventsLabel: LOADING_VALUE,
                usersLabel: LOADING_VALUE,
                errorsLabel: LOADING_VALUE
            };
        } else if (state === DataState.ERROR || sourceStats.source === DEFAULT_VALUE) {
            return {
                eventsLabel: DEFAULT_VALUE,
                usersLabel: DEFAULT_VALUE,
                errorsLabel: DEFAULT_VALUE
            };
        }

        const selectedEntries = (entries instanceof Array) ? entries : [ entries ];
        const selectedStats: LogService.TotalStat[] = [];
        for (let entry of selectedEntries) {
            const stat = sourceStats[entry];
            if (stat) {
                selectedStats.push(stat);
            }
        }

        const stats = addStats(selectedStats);

        return {
            eventsLabel: stats.totalEvents.toString(),
            usersLabel: stats.totalUsers.toString(),
            errorsLabel: stats.totalExceptions.toString()
        };
    }

    retrieveSourceStats(source: Source, start: moment.Moment, end: moment.Moment) {
        const dataLoader: DataLoader<LogService.SourceStats, LogService.SourceStats> = {
            loadData: function (query: Query): Promise<LogService.SourceStats> {
                return LogService.getSourceSummary(query);
            },
            map: function (data: LogService.SourceStats): LogService.SourceStats {
                return data;
            }
        };

        const callback: GenericStateHandler<LogService.SourceStats> = new GenericStateHandler(this.state, "statsLoaded", "sourceStats", this.setState);
        const loader: Loader<LogService.SourceStats, LogService.SourceStats> = new Loader<LogService.SourceStats, LogService.SourceStats>(dataLoader, callback, callback);

        const query: Query = new Query();
        query.add(new SourceParameter(source));
        query.add(new StartTimeParameter(start));
        query.add(new EndTimeParameter(end));

        loader.load(query);
    }

    render() {
        const { selectedEntries } = this.props;
        const { sourceStats, statsLoaded } = this.state;
        const { eventsLabel, usersLabel, errorsLabel } = SourceStats.getLabel(sourceStats, statsLoaded, selectedEntries);

        return (
            <Grid>
                <Cell col={4}>
                    <DataTile
                        value={eventsLabel}
                        label={"Total Events"} />
                </Cell>
                <Cell col={4}>
                    <DataTile
                        value={usersLabel}
                        label={"Unique Users"} />
                </Cell>
                <Cell col={4}>
                    <DataTile
                        value={errorsLabel}
                        label={"Total Errors"} />
                </Cell>
            </Grid>
        );
    }
}

export default SourceStats;