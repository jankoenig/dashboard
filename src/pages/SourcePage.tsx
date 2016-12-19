import * as moment from "moment";
import * as React from "react";
import { connect } from "react-redux";
import { VictoryChart, VictoryGroup, VictoryLine, VictoryPie, VictoryScatter } from "victory";

import { Cell, Grid } from "../components/Grid";
import Log from "../models/log";
import Source from "../models/source";
import { State } from "../reducers";

interface SourcePageProps {
    source: Source;
    logs: Log[];
}

function mapStateToProps(state: State.All) {
    return {
        logs: state.log.logs,
        source: state.source.currentSource
    };
}

function mapDispatchToProps(dispatch: Redux.Dispatch<any>) {
    return {
    };
}

export class SourcePage extends React.Component<SourcePageProps, any> {

    render() {
        console.log(this.props.logs);
        return (
            <span>
                <Grid style={{ backgroundColor: "grey" }}>
                    <Cell col={12} >
                        {this.props.source ? (
                            <span>
                                <span> Project Name </span>
                                <span> {this.props.source.name} </span>
                                <span> Project ID </span>
                                <span> {this.props.source.id} </span>
                                <span> Created {moment(this.props.source.created).format("MMM Do, YYYY")} </span>
                            </span>
                        ) : undefined}
                    </Cell>
                </Grid>
                <Grid>
                    <Cell col={4}> <VictoryPie /> </Cell>
                    <Cell col={4}>
                        <VictoryChart>
                            <VictoryGroup>
                                <VictoryLine />
                                <VictoryScatter />
                            </VictoryGroup>
                        </VictoryChart>
                    </Cell>
                </Grid>
            </span>
        );

    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SourcePage);