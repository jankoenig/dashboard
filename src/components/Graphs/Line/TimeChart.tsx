import * as moment from "moment";
import * as React from "react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface TimeChartProps {
    data: any[];
    tickFormat?: string;
    labelFormat?: string;
}

interface TimeChartState {
    ticks: number[];
}

class TimeChart extends React.Component<TimeChartProps, TimeChartState> {

    constructor(props: TimeChartProps) {
        super(props);
        this.tickFormat = this.tickFormat.bind(this);
        this.labelFormat = this.labelFormat.bind(this);

        this.state = {
            ticks: this.createTicks(props)
        };
    }

    static defaultProps: TimeChartProps = {
        data: [],
        tickFormat: "MM/DD",
        labelFormat: "MM/DD hh:mm a"
    };

    componentWillReceiveProps(nextProps: TimeChartProps, context: any) {
        this.state.ticks = this.createTicks(nextProps);
        this.setState(this.state);
    }

    createTicks(props: TimeChartProps): number[] {
        const data: any[] = props.data;
        if (data.length === 0) {
            return [];
        }

        let lastDate: moment.Moment = moment(props.data[0].time).startOf("day");
        let ticks: number[] = [ data[0].time ];
        for (let i = 1; i < data.length; ++i) {
            const time: number = props.data[i].time;
            const currentDate: moment.Moment = moment(time).startOf("day");
            if (currentDate.isAfter(lastDate)) {
                ticks.push(time);
                lastDate = currentDate;
            } else if (currentDate.isBefore(lastDate)) {
                ticks.unshift(time);
                lastDate = currentDate;
            }
        }
        return ticks;
    }

    tickFormat(time: number): string {
        const format = moment(time).format(this.props.tickFormat);
        return format;
    }

    labelFormat(time: string): string {
        return moment(time).format(this.props.labelFormat);
    }

    render() {
        return (
            <ResponsiveContainer>
                <LineChart data={this.props.data} >
                    <XAxis dataKey="time" tickFormatter={this.tickFormat} ticks={this.state.ticks}/>
                    <YAxis />
                    <Tooltip labelFormatter={this.labelFormat} />
                    <Line type="monotone" dataKey="total" stroke="#FF0000" dot={false} />
                    <Line type="monotone" dataKey="amazon.alexa" name={"Alexa"} stroke="#00FF00" dot={false} />
                    <Line type="monotone" dataKey="google.home" name={"Home"} stroke="#0000FF" dot={false} />
                </LineChart>
            </ResponsiveContainer>
        );
    }
}

export default TimeChart;