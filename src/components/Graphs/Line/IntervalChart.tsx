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
    baseline?: moment.Moment;
}

interface IntervalChartProps {
    data: IntervalData[];
    tickFormat?: string;
    startDate: moment.Moment;
    endDate: moment.Moment;
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
      let highest: moment.Moment = moment(data[0].intervalDate).startOf("day");
      let lowest: moment.Moment = moment(data[0].intervalDate).startOf("day");
      let ticks: number[] = [ data[0].intervalDate.valueOf() ];
      for (let i = 1; i < data.length; ++i) {
        const currentDate: moment.Moment = moment(data[i].intervalDate).startOf("day");
        if (currentDate.isAfter(highest)) {
          ticks.push(data[i].intervalDate.valueOf());
          highest = currentDate;
        } else if (currentDate.isBefore(lowest)) {
          ticks.unshift(data[i].intervalDate.valueOf());
          lowest = currentDate;
        }
      }
      return ticks;
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
                    <Line dataKey="baseline"/>
                    <Line dataKey="avgResponseTime" dot={false} />
                    <Legend verticalAlign="top" align="center" height={36} payload={[{ value: "Average Response Time (milliseconds)", type: "line", id: "ID01" }]} />
                </LineChart>
            </ResponsiveContainer>
        );
    }
}

export default IntervalChart;
