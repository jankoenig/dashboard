import * as React from "react";

import { Cell, Grid } from "../../components/Grid";
import Source from "../../models/source";
import { AMAZON_ORANGE, BLACK, GOOGLE_GREEN } from "../../utils/colors";
import SourceIntentSummary from "./SourceIntentSummary";
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


    constructor(props: SourceFullSummaryProps) {
        super(props);

        this.handleOriginChange = this.handleOriginChange.bind(this);

        this.state = {
            sourceOptions: SourceFullSummary.options.slice(),
            lines: SourceFullSummary.lines.slice()
        };
    }

    handleOriginChange(index: number, label: string) {
        this.state.sourceOptions[index].checked = !this.state.sourceOptions[index].checked;
        this.state.lines = [];
        for (let i = 0; i < this.state.sourceOptions.length; ++i) {
            if (this.state.sourceOptions[i].checked) {
                this.state.lines.push(SourceFullSummary.lines[i]);
            }
        }
        this.setState(this.state);
    }

    render() {
        const { header, ...others } = this.props;
        const { lines } = this.state;
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
                                {...others} />
                        </Cell>
                    </Grid>
                </span>
            </div>
        );
    }
}

export default SourceFullSummary;