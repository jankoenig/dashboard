import * as moment from "moment";
import * as React from "react";

import DataTile from "../../components/DataTile";
import { Cell, Grid } from "../../components/Grid";
import * as LoadingComponent from "../../components/LoadingComponent";
import Query, { EndTimeParameter, SourceParameter, StartTimeParameter } from "../../models/query";
import Source from "../../models/source";
import LogService from "../../services/log";
import SourceUtils from "../../utils/Source";

const DEFAULT_VALUE: string = "N/A";
const LOADING_VALUE: string = "Loading...";

type ENTRY = "stats" | "Amazon.Alexa" | "Google.Home" | "Unknown";

interface Labels {
    eventsLabel: string;
    usersLabel: string;
    errorsLabel: string;
}

interface SourceStatsProps extends LoadingComponent.LoadingComponentProps {
    source: Source;
    startDate: moment.Moment;
    endDate: moment.Moment;
    selectedEntries?: ENTRY | ENTRY[];
}

interface SourceStatsState extends LoadingComponent.LoadingComponentState<LogService.SourceStats> {
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

function getLabel(sourceStats: LogService.SourceStats, state: LoadingComponent.LoadingState, entries: ENTRY | ENTRY[]): Labels {
    if (state === LoadingComponent.LoadingState.LOADING) {
        return {
            eventsLabel: LOADING_VALUE,
            usersLabel: LOADING_VALUE,
            errorsLabel: LOADING_VALUE
        };
    } else if (state === LoadingComponent.LoadingState.LOAD_ERROR || sourceStats.source === DEFAULT_VALUE) {
        return {
            eventsLabel: DEFAULT_VALUE,
            usersLabel: DEFAULT_VALUE,
            errorsLabel: DEFAULT_VALUE
        };
    }

    const selectedEntries = (entries instanceof Array) ? entries : [entries];
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


export class SourceStats extends LoadingComponent.Component<LogService.SourceStats, SourceStatsProps, SourceStatsState> {

    static defaultProps: SourceStatsProps = {
        source: undefined,
        startDate: moment().subtract(7, "days"),
        endDate: moment(),
        selectedEntries: ["stats"]
    };

    static defaultState: any = {
        data: {
                source: DEFAULT_VALUE,
                stats: newStats(),
                "Amazon.Alexa": newStats(),
                "Google.Home": newStats(),
                Unknown: newStats()
            }
    };

    constructor(props: SourceStatsProps) {
        super(props, SourceStats.defaultState);
    }

    shouldUpdate(oldProps: SourceStatsProps, newProps: SourceStatsProps) {
        if (!newProps) {
            return oldProps.source !== undefined;
        } else {
            return !SourceUtils.equals(newProps.source, this.props.source)
                || !newProps.startDate.isSame(this.props.startDate)
                || !newProps.endDate.isSame(this.props.endDate);
        }
    }

    startLoading(props: SourceStatsProps): Thenable<LogService.SourceStats> {
        const query: Query = new Query();
        query.add(new SourceParameter(props.source));
        query.add(new StartTimeParameter(props.startDate));
        query.add(new EndTimeParameter(props.endDate));
        return LogService.getSourceSummary(query);
    }

    render() {
        const { selectedEntries } = this.props;
        const { data, state } = this.state;
        const { eventsLabel, usersLabel, errorsLabel } = getLabel(data, state, selectedEntries);

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