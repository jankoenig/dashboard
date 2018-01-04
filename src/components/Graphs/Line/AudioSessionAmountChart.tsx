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
    averageSessionsPerDay?: number;
}

interface AudioSessionChartProps {
    data: AudioSessionData;
    averageSessionsPerDay?: number;
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

    YTickFormat(amount: number): string {
        return amount ? amount.toString() : "";
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

    labelFormat(time: any) {
        return moment(time).format(this.props.labelFormat);
    }

    render() {
        const renderLegend = (props: any) => {
            return (
                <div style={{textAlign: "left", marginBottom: 15, paddingLeft: 35}}>
                    <div style={{fontSize: "1.2em", fontWeight: "bold", marginBottom: 5}}>Sessions Per Day</div>
                </div>
            );
        };
        return (
            <ResponsiveContainer>
                <LineChart data={this.props.data.audioSessions} >
                    <XAxis dataKey="sessionStartTime" tickFormatter={this.tickFormat} ticks={this.state.ticks} />
                    <YAxis width={80} tickFormatter={this.YTickFormat} />
                    <Legend verticalAlign={"top"} content={renderLegend} />
                    <Tooltip labelFormatter={this.labelFormat} />
                    <Line type="monotone" dataKey="amount" dot={false} />
                </LineChart>
            </ResponsiveContainer>
        );
    }
}

export default AudioSessionChart;
