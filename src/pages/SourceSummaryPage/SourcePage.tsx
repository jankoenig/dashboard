import * as moment from "moment";
import * as React from "react";
import { connect } from "react-redux";

import Source from "../../models/source";
import { State } from "../../reducers";

import SourceFullSummary from "./SourceFullSummary";

interface SourcePageProps {
    source: Source;
}

interface SourcePageState {
}

function mapStateToProps(state: State.All) {
    return {
        source: state.source.currentSource
    };
}

function mapDispatchToProps(dispatch: Redux.Dispatch<any>) {
    return {
    };
}

export class SourcePage extends React.Component<SourcePageProps, SourcePageState> {

    dialogActions: any[];

    constructor(props: SourcePageProps) {
        super(props);
    }

    render() {
        const { source } = this.props;
        const start = moment().subtract(7, "days");
        const end = moment();
        return (
                <SourceFullSummary
                    header={"Last Seven Day Summary"}
                    source={source}
                    startDate={start}
                    endDate={end} />
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SourcePage);