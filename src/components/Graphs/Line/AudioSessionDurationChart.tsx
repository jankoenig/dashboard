import * as moment from "moment";
import * as React from "react";
import { Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import ChartUtils from "../../../utils/chart";

export interface LineProps {
    dataKey: string;
    type?: "basis" | "basisClosed" | "basisOpen" | "linear" | "linearClosed" | "natural" | "monotoneX" | "monotoneY" | "monotone" | "step" | "stepBefore" | "stepAfter" | Function;
    dot?: boolean;
    name?: string;
    stroke?: string;
}

export class AudioSessionData {
    audioSessions: any[];
    averageSessionDuration?: number;
}

interface AudioSessionChartProps {
    data: AudioSessionData;
    averageSessionDuration?: number;
    tickFormat?: string;
    startDate?: moment.Moment;
    endDate?: moment.Moment;
    labelFormat?: string;
}

interface UpTimeChartState {
    ticks: number[];
}

class AudioSessionChart extends React.Component<AudioSessionChartProps, UpTimeChartState> {

    static defaultLineProp: LineProps = {
        dataKey: "",
        dot: false,
        type: "monotone"
    };

    static createTicks(props: AudioSessionChartProps): number[] {
      const data: AudioSessionData = props.data;
      if (data.audioSessions.length === 0) {
        return [];
      }
      return ChartUtils.createTicks(data.audioSessions, "sessionStartTime");
    }

    constructor(props: AudioSessionChartProps) {
        super(props);
        this.tickFormat = this.tickFormat.bind(this);
        this.customTooltip = this.customTooltip.bind(this);

        this.state = {
          ticks: AudioSessionChart.createTicks(props)
        };
    }

    tickFormat(time: Date): string {
      return moment(time).format(this.props.tickFormat);
    }

    YTickFormat(duration: number): string {
        return getTimeString(duration, false);
    }

    static defaultProps: AudioSessionChartProps = {
        data: { audioSessions: [] },
        tickFormat: "MM/DD",
        labelFormat: "MM/DD",
        startDate: moment().subtract(7, "days"),
        endDate: moment(),
    };

    componentWillReceiveProps(nextProps: AudioSessionChartProps, context: any) {
        this.state.ticks = AudioSessionChart.createTicks(nextProps);
        this.setState(this.state);
    }

    customTooltip(props: any) {
    if (props.active) {
        const { payload } = props;
        const {duration} = payload[0].payload;
        let durationString = duration;
        const startTime = moment(payload[0].payload.sessionStartTime).format(this.props.labelFormat);
        if (duration) {
            durationString = getTimeString(duration);
        }

        return (
            <div className="recharts-default-tooltip">
                <ul style={{listStyle: "none", border: "1px solid #ccc", padding: 10}}>
                    <li className="recharts-tooltip-item">{startTime}</li>
                    <li style={{color: payload[0].color}} className="recharts-tooltip-item">duration: {durationString}</li>
                </ul>
            </div>
        );
    }

    return <div />;
}


    render() {
        const renderLegend = (props: any) => {
            return (
                <div style={{textAlign: "left", marginBottom: 15, paddingLeft: 35}}>
                    <div style={{fontSize: "1.2em", fontWeight: "bold", marginBottom: 5}}>Average Session Duration</div>
                </div>
            );
        };
        return (
            <ResponsiveContainer>
                <LineChart data={this.props.data.audioSessions} >
                    <XAxis dataKey="sessionStartTime" tickFormatter={this.tickFormat} ticks={this.state.ticks} />
                    <YAxis width={80} tickFormatter={this.YTickFormat} domain={[0, "dataMax"]} />
                    <Legend verticalAlign={"top"} content={renderLegend} />
                    <Tooltip content={this.customTooltip} />
                    <Line type="monotone" name="Avg. Duration" dataKey="duration" dot={false} />
                </LineChart>
            </ResponsiveContainer>
        );
    }
}

export default AudioSessionChart;

function getTimeString(duration: number, withMilliseconds: boolean = true) {
    if (duration <= 0) return "0";
    const milliseconds = Math.floor(duration % 1000);
    const seconds = Math.floor(duration / 1000) % 60;
    const minutes = Math.floor(duration / (1000 * 60)) % 60;
    const hours = Math.floor(duration / (1000 * 60 * 60)) % 24;
    const hoursText = (hours < 10) ? "0" + hours : hours;
    const minutesText = (minutes < 10) ? "0" + minutes : minutes;
    const secondsText = (seconds < 10) ? "0" + seconds : seconds;
    return `${hours === 0 ?  "" : hoursText + ":"}${(hours === 0 && minutes === 0) ? "" : minutesText + ":"}${(hours === 0 && minutes === 0 && seconds === 0) ? "" : secondsText}${(withMilliseconds ? "." + milliseconds : "")}`;
}
