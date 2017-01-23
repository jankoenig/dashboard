import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export interface CountData {
    title: string;
    count: number;
}

interface IntentCountChartProps {
    data: CountData[];
}

interface IntentCountChartState {

}

class IntentCountChart extends React.Component<IntentCountChartProps, IntentCountChartState> {

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
                    <Bar dataKey="count" fill="rgb(49, 130, 189)" />
                </BarChart>
            </ResponsiveContainer>
        );
    }
}

export default IntentCountChart;
