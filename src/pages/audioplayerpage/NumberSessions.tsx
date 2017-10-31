import * as moment from "moment";
import * as React from "react";
import ProgressBar from "react-toolbox/lib/progress_bar";

import AudioSessionChart, {AudioSessionData} from "../../components/Graphs/Line/AudioSessionChart";
import {Grid} from "../../components/Grid";
import * as LoadingComponent from "../../components/LoadingComponent";
import Query, {EndTimeParameter, SourceParameter, StartTimeParameter} from "../../models/query";
import AudioPlayerService from "../../services/log";

interface AudioSessionsProps extends LoadingComponent.LoadingComponentProps {
    source: string;
    startDate: moment.Moment;
    endDate: moment.Moment;
    refreshInterval?: number;
}

interface AudioSessionState extends LoadingComponent.LoadingComponentState<AudioSessionData> {
    refreshId?: any;
}

export class AudioSession extends LoadingComponent.Component<AudioSessionData, AudioSessionsProps, AudioSessionState> {

    static defaultProps: AudioSessionsProps = {
        source: undefined,
        startDate: moment().subtract(7, "days"),
        endDate: moment(),
        refreshInterval: 60000,
    };

    constructor(props: AudioSessionsProps) {
        super(props, {data: {audioSessions: [], averageSessionDuration: 0, sessionsAmount: 0}} as AudioSessionState);
    }

    componentDidMount () {
        this.props.refreshInterval && this.setState({...this.state, refreshId: setInterval(() => this.refresh(), this.props.refreshInterval)});
    }

    componentWillUnmount () {
        clearInterval(this.state.refreshId);
    }

    async refresh () {
        const { source } = this.props;
        if (!source) return;
        this.mapState({ data: [], sourceState: 1});
        const query: Query = new Query();
        query.add(new SourceParameter(source));
        query.add(new StartTimeParameter(moment().subtract(7, "days")));
        query.add(new EndTimeParameter(moment()));

        let formatedData;
        try {
            const [sessions, duration] = await Promise.all([AudioPlayerService.getAudioSessions(query), AudioPlayerService.getAudioDuration(query)]);
            formatedData = { audioSessions: sessions.audioSessions, averageSessionDuration : duration.averageAudioSessionDuration, sessionsAmount: sessions.audioSessionsAmount };
        } catch (err) {
            formatedData = { audioSessions: [], averageSessionDuration: 0, sessionsAmount: 0 };
        }
        this.mapState({data: formatedData});
    }

    shouldUpdate(oldProps: AudioSessionsProps, newProps: AudioSessionsProps) {
        if (!newProps) {
            return true;
        } else {
            return !(newProps.source === oldProps.source)
                || !newProps.startDate.isSame(oldProps.startDate)
                || !newProps.endDate.isSame(oldProps.endDate);
        }
    }

    preLoad(props: AudioSessionsProps) {
        return this.mapState({data: [], sourceState: 1});
    }

    async startLoading(props: AudioSessionsProps): Promise<any> {
        const {source, startDate, endDate} = props;

        if (!source) {
            return [];
        }

        const query: Query = new Query();
        query.add(new SourceParameter(source));
        query.add(new StartTimeParameter(startDate));
        query.add(new EndTimeParameter(endDate));
        try {
            const [sessions, duration] = await Promise.all([AudioPlayerService.getAudioSessions(query), AudioPlayerService.getAudioDuration(query)]);
            return {
                audioSessions: sessions.audioSessions,
                averageSessionDuration: duration.averageAudioSessionDuration,
                sessionsAmount: sessions.audioSessionsAmount
            };
        } catch (err) {
            return {audioSessions: [], averageSessionDuration: 0, sessionsAmount: 0};
        }
    }

    map(data: any): any {
        return data;
    }

    onLoadError(err: Error) {
        return this.mapState([]);
    }

    render() {
        const {data} = this.state;
        if (!data || !data.audioSessions || !data.averageSessionDuration || !data.sessionsAmount) {
            return (
               <Grid className="graph-loader">
                    <ProgressBar className="graph-loader" type="circular" mode="indeterminate" />
                </Grid>
            );
        }
        console.log(data);
        return (
            <AudioSessionChart
                startDate={this.props.startDate}
                endDate={this.props.endDate}
                data={data}
                averageSessionDuration={data.averageSessionDuration}
                sessionsAmount={data.sessionsAmount} />
        );
    }
}

export default AudioSession;
