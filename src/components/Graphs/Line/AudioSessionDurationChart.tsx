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
        const minutes = Math.floor(duration / 6000);
        const seconds = (duration % 6000) / 1000;
        const tick = ("0" + minutes).slice(-2) + "m:" + ("0" + seconds).slice(-2) + "s";
        return tick;
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
            const minutes = Math.floor(duration / 6000);
            const seconds = (duration % 6000) / 1000;
            durationString = ("0" + minutes).slice(-2) + "m:" + ("0" + seconds).slice(-2) + "s";
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
                <div style={{textAlign: "center", marginBottom: 15}}>
                    <div style={{fontSize: "1.2em", fontWeight: "bold", marginBottom: 5}}>Average Session Duration</div>
                </div>
            );
        };
        return (
            <ResponsiveContainer>
                <LineChart data={this.props.data.audioSessions} >
                    <XAxis dataKey="sessionStartTime" tickFormatter={this.tickFormat} ticks={this.state.ticks} />
                    <YAxis width={80} tickFormatter={this.YTickFormat} />
                    <Legend verticalAlign={"top"} content={renderLegend} />
                    <Tooltip content={this.customTooltip} />
                    <Line type="monotone" name="Avg. Duration" dataKey="duration" dot={false} />
                </LineChart>
            </ResponsiveContainer>
        );
    }
}

export default AudioSessionChart;
