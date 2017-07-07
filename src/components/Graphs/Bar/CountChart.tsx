import * as React from "react";
import { Bar, BarChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

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

interface Payload {
  value?: string;
}

interface CustomizedAxisTickProps {
  x?: number;
  y?: number;
  newX?: number;
  newY?: number;
  payload?: Payload;
}

interface CustomizedAxisTickState {
}

class CustomizedAxisTick extends React.Component<CustomizedAxisTickProps, CustomizedAxisTickState> {
  static defaultProps: {
    newX: 0,
    newY: 0,
  };
  render () {
    const {payload} = this.props;
    return (
      <g transform={`translate(${this.props.newX},${this.props.newY})`}>
        <text style={{ fontWeight: "bold" }} x={this.props.x} y={this.props.y} textAnchor="start">{payload.value}</text>
      </g>
    );
  }
};

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
            const prop = { ...IntentCountChart.defaultLineProp, ...bar};
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
                    margin={{ left: -130 }}
                    barSize={30}
                    barCategoryGap={80}>
                    <XAxis type="number" orientation="top" />
                    <Tooltip />
                    {IntentCountChart.createBars(this.props)}
                    <YAxis margin={{ left: 150 }} width={150} tick={<CustomizedAxisTick newX={25} newY={5} />} type="category" dataKey="title" />
                    <Legend verticalAlign="top" align="center" height={12} payload={[{ value: "Number Of Events Per Intent", type: "line", id: "ID01" }]} />
                </BarChart>
            </ResponsiveContainer>
        );
    }
}

export default IntentCountChart;
