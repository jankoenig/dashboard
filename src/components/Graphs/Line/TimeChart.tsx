import * as moment from "moment";
import * as React from "react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export interface TimeData {
    time: string;
    count?: number;
}

interface TimeChartProps {
    data: TimeData[];
    tickFormat?: string;
    labelFormat?: string;
}

interface TimeChartState {
}

class TimeChart extends React.Component<TimeChartProps, TimeChartState> {

    constructor(props: TimeChartProps) {
        super(props);
        this.tickFormat = this.tickFormat.bind(this);
        this.labelFormat = this.labelFormat.bind(this);
    }

    static defaultProps: TimeChartProps = {
        data: [],
        tickFormat: "MM/DD",
        labelFormat: "MM/DD"
    };

    tickFormat(time: Date): string {
        return moment(time).format(this.props.tickFormat);
    }

    labelFormat(time: string): string {
        return moment(time).format(this.props.labelFormat);
    }

    render() {
        return (
            <ResponsiveContainer>
                <LineChart data={this.props.data} >
                    <XAxis dataKey="time" tickFormatter={this.tickFormat} />
                    <YAxis dataKey="count" />
                    <Tooltip labelFormatter={this.labelFormat} />
                    <Line type="monotone" dataKey="count" dot={false} />
                </LineChart>
            </ResponsiveContainer>
        );
    }
}

export default TimeChart;