import * as React from "react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export interface BarProps {
    dataKey: string;
    fill?: string;
    name?: string;
    stackId?: string;
}

export interface CountData {
    title: string;
    count?: number;
}

interface IntentCountChartProps {
    data: CountData[];
    bars?: BarProps[];
}

interface IntentCountChartState {

}

class IntentCountChart extends React.Component<IntentCountChartProps, IntentCountChartState> {

    static defaultLineProp: BarProps = {
        dataKey: "count",
        fill: "rgb(49, 130, 189)"
    };

    static defaultProps: IntentCountChartProps = {
        data: [],
        bars: [IntentCountChart.defaultLineProp]
    };

    static createBars(props: IntentCountChartProps): JSX.Element[] {
        const bars: JSX.Element[] = [];
        let i = 0;
        for (let bar of props.bars) {
            const prop = { ...IntentCountChart.defaultLineProp, ...bar };
            bars.push(<Bar key={i++} {...prop} />);
        }
        return bars;
    }

    render() {
        return (
            <ResponsiveContainer>
                <BarChart
                    layout="vertical"
                    data={this.props.data}
                    margin={{ left: 200 }}
                    barSize={30}
                    barCategoryGap={80}>
                    <XAxis type="number" orientation="top" />
                    <YAxis type="category" dataKey="title" />
                    <Tooltip />
                    {IntentCountChart.createBars(this.props)}
                </BarChart>
            </ResponsiveContainer>
        );
    }
}

export default IntentCountChart;
