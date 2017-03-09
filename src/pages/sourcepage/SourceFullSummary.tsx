import * as React from "react";

import { Cell, Grid } from "../../components/Grid";
import Source from "../../models/source";
import SourceIntentSummary from "./SourceIntentSummary";
import SourceStats from "./SourceStats";
import SourceTimeSummary from "./SourceTimeSummary";

interface SourceFullSummaryProps {
    header: string;
    source: Source;
    startDate: moment.Moment;
    endDate: moment.Moment;
}

interface SourceFullSummaryState {

}

export class SourceFullSummary extends React.Component<SourceFullSummaryProps, SourceFullSummaryState> {
    render() {
        const { header, source, startDate, endDate } = this.props;
        return (
            <div>
                <Grid>
                    <h4>{header}</h4>
                </Grid>
                <span>
                    <SourceStats
                        source={source}
                        startDate={startDate}
                        endDate={endDate} />
                    <Grid>
                        <Cell col={12} style={{ height: 300 }}>
                            <SourceTimeSummary
                                source={source}
                                startDate={startDate}
                                endDate={endDate} />
                        </Cell>
                    </Grid>
                    <Grid>
                        <Cell col={12} >
                            <SourceIntentSummary
                                source={source}
                                startDate={startDate}
                                endDate={endDate} />
                        </Cell>
                    </Grid>
                </span>
            </div>
        );
    }
}

export default SourceFullSummary;