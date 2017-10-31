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
    sessionsAmount?: number;
}

interface AudioSessionChartProps {
    data: AudioSessionData;
    averageSessionDuration?: number;
    sessionsAmount?: number;
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
        this.labelFormat = this.labelFormat.bind(this);

        this.state = {
          ticks: AudioSessionChart.createTicks(props)
        };
    }

    tickFormat(time: Date): string {
      return moment(time).format(this.props.tickFormat);
    }

    YTickFormat(statusValue: number): string {
      return statusValue === 1 ? "Up" : " ";
    }

    static defaultProps: AudioSessionChartProps = {
        data: { audioSessions: [] },
        tickFormat: "MM/DD",
        labelFormat: "MM/DD hh:mm a",
        startDate: moment().subtract(7, "days"),
        endDate: moment(),
    };

    componentWillReceiveProps(nextProps: AudioSessionChartProps, context: any) {
        this.state.ticks = AudioSessionChart.createTicks(nextProps);
        this.setState(this.state);
    }

    labelFormat(time: any) {
        return moment(time).format(this.props.labelFormat);
    }

    render() {
        const renderLegend = (props: any) => {
            return (
                <div style={{textAlign: "center", marginBottom: 15}}>
                    <div style={{fontSize: "1.2em", fontWeight: "bold", marginBottom: 5}}>{this.props.data.audioSessions[0].sourceId}</div>
                    <b>Avg. Duration:</b> {this.props.averageSessionDuration.toFixed(2)} ms
                    <br/>
                    <b>Number of Sessions:</b> {this.props.sessionsAmount}
                </div>
            );
        };
        return (
            <ResponsiveContainer>
                <LineChart data={this.props.data.audioSessions} >
                    <XAxis dataKey="sessionStartTime" tickFormatter={this.tickFormat} ticks={this.state.ticks} />
                    <YAxis />
                    <Legend verticalAlign={"top"} content={renderLegend} />
                    <Tooltip labelFormatter={this.labelFormat} />
                    <Line type="monotone" dataKey="duration" dot={false} />
                </LineChart>
            </ResponsiveContainer>
        );
    }
}

export default AudioSessionChart;
