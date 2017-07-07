import * as moment from "moment";
import * as React from "react";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import ChartUtils from "../../../utils/chart";

export interface LineProps {
    dataKey: string;
    type?: "basis" | "basisClosed" | "basisOpen" | "linear" | "linearClosed" | "natural" | "monotoneX" | "monotoneY" | "monotone" | "step" | "stepBefore" | "stepAfter" | Function;
    dot?: boolean;
    name?: string;
    stroke?: string;
}

export class IntervalData {
    interval?: number;
    avgResponseTime?: number;
    intervalDate: moment.Moment;
}

interface IntervalChartProps {
    data: IntervalData[];
    tickFormat?: string;
    startDate?: moment.Moment;
    endDate?: moment.Moment;
}

interface IntervalChartState {
    ticks: number[];
}

class IntervalChart extends React.Component<IntervalChartProps, IntervalChartState> {

    static defaultLineProp: LineProps = {
        dataKey: "",
        dot: false,
        type: "monotone"
    };

    static createTicks(props: IntervalChartProps): number[] {
      const data: IntervalData[] = props.data;
      if (data.length === 0) {
        return [];
      }
      return ChartUtils.createTicks(data, "intervalDate");
    }

    constructor(props: IntervalChartProps) {
        super(props);
        this.tickFormat = this.tickFormat.bind(this);

        this.state = {
          ticks: IntervalChart.createTicks(props)
        };
    }

    tickFormat(time: Date): string {
      return moment(time).format(this.props.tickFormat);
    }

    static defaultProps: IntervalChartProps = {
        data: [],
        tickFormat: "MM/DD",
        startDate: moment().subtract(7, "days"),
        endDate: moment(),
    };

    componentWillReceiveProps(nextProps: IntervalChartProps, context: any) {
        this.state.ticks = IntervalChart.createTicks(nextProps);
        this.setState(this.state);
    }

    render() {
        return (
            <ResponsiveContainer>
                <LineChart margin={{ left: -20 }}  data={this.props.data} >
                    <XAxis dataKey="interval" tickFormatter={this.tickFormat} ticks={this.state.ticks} />
                    <YAxis />
                    <CartesianGrid fill="#fff" strokeDasharray="3 3" />
                    <Line dataKey="avgResponseTime" dot={false} />
                    <Legend verticalAlign="top" align="center" height={36} payload={[{ value: "Average Response Time (Milliseconds)", type: "line", id: "ID01" }]} />
                </LineChart>
            </ResponsiveContainer>
        );
    }
}

export default IntervalChart;
