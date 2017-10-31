import * as moment from "moment";
import * as React from "react";
import { connect } from "react-redux";
import { replace, RouterAction } from "react-router-redux";

import { Cell, Grid } from "../../components/Grid";
import Source from "../../models/source";
import { State } from "../../reducers";
import AudioSessionSummary from "./NumberSessions";

interface SourcePageProps {
    source: Source;
    goHome: () => RouterAction;
    removeSource: (source: Source) => Promise<Source>;
}

interface SourcePageState {
    deleteDialogActive: boolean;
}

function mapStateToProps(state: State.All) {
    return {
        source: state.source.currentSource
    };
}

function mapDispatchToProps(dispatch: Redux.Dispatch<any>) {
    return {
        goHome: function (): RouterAction {
            return dispatch(replace("/skills"));
        }
    };
}

export class SourcePage extends React.Component<SourcePageProps, SourcePageState> {

    constructor(props: SourcePageProps) {
        super(props);
    }

    render() {
        const { source } = this.props;
        const sourceName = (source) ? source.name : "this skill";
        const start = moment().subtract(7, "days");
        const end = moment();
        if (!source) {
            return (<div />);
        }
        return (
            <div style={{margin: 25}}>
                <h3>Last seven days summary</h3>
                <Grid>
                    <Cell style={{height: 300}}>
                        <AudioSessionSummary
                            source={sourceName}
                            startDate={start}
                            endDate={end} />
                    </Cell>
                </Grid>
            </div>
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SourcePage);
