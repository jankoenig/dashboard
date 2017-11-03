import * as moment from "moment";
import * as React from "react";
import { connect } from "react-redux";
import { replace, RouterAction } from "react-router-redux";

import { Cell, Grid } from "../../components/Grid";
import Source from "../../models/source";
import { State } from "../../reducers";
import AudioPlayerStats from "./AudioPlayerStats";
import AudioSessionNumber  from "./NumberSessions";
import AudioSessionDuration from "./SessionDuration";

interface AudioPlayerPageProps {
    source: Source;
    goHome: () => RouterAction;
}

interface AudioPlayerPageState {
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

export class AudioPlayerPage extends React.Component<AudioPlayerPageProps, AudioPlayerPageState> {

    constructor(props: AudioPlayerPageProps) {
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
                <Grid className="custom-spacing" noSpacing={true}>
                    <Cell className="stats" tablet={8} col={6}>
                        <AudioPlayerStats
                            source={sourceName}
                            startDate={start}
                            endDate={end} />
                    </Cell>
                </Grid>
                <Grid>
                    <Cell col={6} style={{height: 300}}>
                        <AudioSessionDuration
                            source={sourceName}
                            startDate={start}
                            endDate={end} />
                    </Cell>
                    <Cell col={6} style={{height: 300}}>
                        <AudioSessionNumber
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
)(AudioPlayerPage);
