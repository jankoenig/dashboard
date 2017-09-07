import * as moment from "moment";
import * as React from "react";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

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
    ticks?: number[];
    tickFormat?: string;
    startDate?: moment.Moment;
    endDate?: moment.Moment;
}

interface IntervalChartState {
}

class IntervalChart extends React.Component<IntervalChartProps, IntervalChartState> {

    static defaultLineProp: LineProps = {
        dataKey: "",
        dot: false,
        type: "monotone"
    };

    constructor(props: IntervalChartProps) {
        super(props);
        this.tickFormat = this.tickFormat.bind(this);
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

    render() {
        return (
            <ResponsiveContainer>
                <LineChart margin={{ left: -20 }}  data={this.props.data} >
                    <XAxis dataKey="interval" tickFormatter={this.tickFormat} ticks={this.props.ticks} />
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
