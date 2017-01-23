import * as moment from "moment";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export interface TimeData {
    time: string;
    value: number;
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
        console.info("TIME " + this.props.tickFormat);
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
                    <YAxis />
                    <Tooltip labelFormatter={this.labelFormat} />
                    <Line type="monotone" dataKey="value" dot={false} />
                </LineChart>
            </ResponsiveContainer>
        );
    }
}

export default TimeChart;