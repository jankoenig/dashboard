import * as moment from "moment";
import * as React from "react";

import DataTile from "../../components/DataTile";
import { Cell, Grid } from "../../components/Grid";
import * as LoadingComponent from "../../components/LoadingComponent";
import Query, { EndTimeParameter, SourceParameter, StartTimeParameter } from "../../models/query";
import LogService from "../../services/log";

const DEFAULT_VALUE: string = "N/A";

type ENTRY = "stats";

interface AudioPlayerStatsProps extends LoadingComponent.LoadingComponentProps {
    source: string;
    startDate: moment.Moment;
    endDate: moment.Moment;
    selectedEntries?: ENTRY | ENTRY[];
}

interface AudioPlayerStatsState extends LoadingComponent.LoadingComponentState<LogService.AudioPlayerStats> {
}

function newStats(avgDuration: number = 0, avgSessions: number = 0): LogService.AudioPlayerTotalStats {
    return {
        avgDuration: avgDuration,
        avgSessionsNumber: avgSessions,
    };
}

// function getLabel(audioPlayerStats: LogService.AudioPlayerStats, state: LoadingComponent.LoadingState, entries: ENTRY | ENTRY[]): Labels {
//     if (state === LoadingComponent.LoadingState.LOADING) {
//         return {
//             avgDurationLabel: LOADING_VALUE,
//             avgSessionsLabel: LOADING_VALUE,
//         };
//     } else if (state === LoadingComponent.LoadingState.LOAD_ERROR || audioPlayerStats.source === DEFAULT_VALUE) {
//         return {
//             avgDurationLabel: DEFAULT_VALUE,
//             avgSessionsLabel: DEFAULT_VALUE,
//         };
//     }
//
//     const selectedEntries = (entries instanceof Array) ? entries : [entries];
//     const selectedStats: LogService.AudioPlayerTotalStats[] = [];
//     for (let entry of selectedEntries) {
//         const stat = audioPlayerStats[entry];
//         if (stat) {
//             selectedStats.push(stat);
//         }
//     }
//
//     const stats = addStats(selectedStats);
//
//     return {
//         avgDurationLabel: stats.avgDuration.toString(),
//         avgSessionsLabel: stats.avgSessionsNumber.toString(),
//     };
// }


export class AudioPlayerStats extends LoadingComponent.Component<LogService.AudioPlayerStats, AudioPlayerStatsProps, AudioPlayerStatsState> {

    static defaultProps: AudioPlayerStatsProps = {
        source: undefined,
        startDate: moment().subtract(7, "days"),
        endDate: moment(),
        selectedEntries: ["stats"]
    };

    static defaultState: any = {
        data: {
                source: DEFAULT_VALUE,
                stats: newStats(),
            }
    };

    constructor(props: AudioPlayerStatsProps) {
        super(props, AudioPlayerStats.defaultState);
    }

    shouldUpdate(oldProps: AudioPlayerStatsProps, newProps: AudioPlayerStatsProps) {
        if (!newProps) {
            return oldProps.source !== undefined;
        } else {
            return newProps.source !== oldProps.source
                || !newProps.startDate.isSame(oldProps.startDate)
                || !newProps.endDate.isSame(oldProps.endDate);
        }
    }

    async startLoading(props: AudioPlayerStatsProps): Promise<LogService.AudioPlayerStats> {
        const query: Query = new Query();
        query.add(new SourceParameter(props.source));
        query.add(new StartTimeParameter(props.startDate));
        query.add(new EndTimeParameter(props.endDate));
        const [sessions, duration] = await Promise.all([LogService.getAudioSessions(query), LogService.getAudioDuration(query)]);
        const audioSessions = sessions.map((audioSession: any) => {
            const sessionStartTime = moment(audioSession._id.year + "-" + audioSession._id.month + "-" + audioSession._id.day).toISOString();
            return {
                sessionStartTime,
                amount: audioSession.count,
            };
        });
        const sessionsAmount = audioSessions.reduce((accum: any, item: any) => {
            return accum + item.amount;
        }, 0);
        const avgSessions = sessionsAmount / audioSessions.length;
        return {source: props.source, stats: {avgDuration: duration.averageAudioSessionDuration, avgSessionsNumber: avgSessions}};
    }

    render() {
        const { data } = this.state;
        let durationString = data && data.stats && data.stats.avgDuration.toString();
        let sessionsString = data && data.stats && data.stats.avgSessionsNumber.toString();
        if (data && data.stats && data.stats.avgDuration) {
            const minutes = Math.floor(data.stats.avgDuration / 6000);
            const seconds = (data.stats.avgDuration % 6000) / 1000;
            durationString = ("0" + minutes).slice(-2) + "m:" + ("0" + seconds).slice(-2) + "s";
        }

        return (
            <Grid noSpacing>
                <Cell phone={2} offsetTablet={1} tablet={3} col={6}>
                    <DataTile
                        smallWidth={true}
                        value={durationString}
                        label={"Average Duration"} />
                </Cell>
                <Cell phone={2} tablet={3} col={6}>
                    <DataTile
                        smallWidth={true}
                        value={sessionsString}
                        label={"Number of Sessions"} />
                </Cell>
            </Grid>
        );
    }
}

export default AudioPlayerStats;
