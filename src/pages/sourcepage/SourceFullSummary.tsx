import * as React from "react";

import { Cell, Grid } from "../../components/Grid";
import Source from "../../models/source";
import { AMAZON_ORANGE, BLACK, GOOGLE_GREEN } from "../../utils/colors";
import SourceIntentSummary, { BarProps } from "./SourceIntentSummary";
import SourceOriginSelector, { SourceOption } from "./SourceOriginSelector";
import SourceStats from "./SourceStats";
import SourceTimeSummary, { LineProps } from "./SourceTimeSummary";

const AllCheckboxTheme = require("./themes/checkbox-all-theme.scss");
const AmazonCheckboxTheme = require("./themes/checkbox-amazon-theme.scss");
const GoogleCheckboxTheme = require("./themes/checkbox-google-theme.scss");

interface SourceFullSummaryProps {
    header: string;
    source: Source;
    startDate: moment.Moment;
    endDate: moment.Moment;
}

interface SourceFullSummaryState {
    sourceOptions: SourceOption[];
    lines: LineProps[];
    bars: BarProps[];
}

export class SourceFullSummary extends React.Component<SourceFullSummaryProps, SourceFullSummaryState> {
    static options: SourceOption[] = [{
        label: "Total",
        theme: AllCheckboxTheme,
        checked: true
    }, {
        label: "Amazon",
        theme: AmazonCheckboxTheme,
        checked: true
    }, {
        label: "Google",
        theme: GoogleCheckboxTheme,
        checked: true
    }];

    static lines: LineProps[] = [{
        dataKey: "total",
        name: "Total",
        stroke: BLACK
    }, {
        dataKey: "Amazon.Alexa",
        name: "Alexa",
        stroke: AMAZON_ORANGE
    }, {
        dataKey: "Google.Home",
        name: "Home",
        stroke: GOOGLE_GREEN
    }];

    static bars: BarProps[] = [{
        dataKey: "Amazon.Alexa",
        name: "Alexa",
        fill: AMAZON_ORANGE,
        stackId: "a"
    }, {
        dataKey: "Google.Home",
        name: "Home",
        fill: GOOGLE_GREEN,
        stackId: "a"
    }];

    constructor(props: SourceFullSummaryProps) {
        super(props);

        this.handleOriginChange = this.handleOriginChange.bind(this);

        this.state = {
            sourceOptions: SourceFullSummary.options.slice(),
            lines: SourceFullSummary.lines.slice(),
            bars: SourceFullSummary.bars.slice()
        };
    }

    handleOriginChange(index: number, label: string) {
        console.info("Handle origin change " + index);
        this.state.sourceOptions[index].checked = !this.state.sourceOptions[index].checked;

        console.log(this.state.sourceOptions);
        this.state.lines = [];
        this.state.bars = [];
        for (let i = 0; i < this.state.sourceOptions.length; ++i) {
            const checked = this.state.sourceOptions[i].checked;
            if (checked) {
                this.state.lines.push(SourceFullSummary.lines[i]);
            }
            if (i > 0) {
                console.info("CHECKING THINGS");
                if (checked) {
                    console.info("Adding " + i);
                    this.state.bars.push(SourceFullSummary.bars[i - 1]);
                }
            }
        }
        this.setState(this.state);
    }

    render() {
        const { header, ...others } = this.props;
        const { bars, lines } = this.state;
        const options = SourceFullSummary.options;
        const handleOriginChange = this.handleOriginChange;

        return (
            <div>
                <Grid>
                    <h4>{header}</h4>
                </Grid>

                <span>
                    <SourceOriginSelector
                        options={options}
                        onCheck={handleOriginChange} />
                    <SourceStats
                        {...others} />
                    <Grid>
                        <Cell col={12} style={{ height: 300 }}>
                            <SourceTimeSummary
                                {...others}
                                lines={lines} />
                        </Cell>
                    </Grid>
                    <Grid>
                        <Cell col={12} >
                            <SourceIntentSummary
                                {...others}
                                bars={bars}/>
                        </Cell>
                    </Grid>
                </span>
            </div>
        );
    }
}

export default SourceFullSummary;