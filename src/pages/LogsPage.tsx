import * as React from "react";
import { connect } from "react-redux";

import { getLogs } from "../actions/log";
import { Cell, Grid } from "../components/Grid";
import Log from "../models/log";
import { Store } from "../reducers";

interface LogsPageProps {
    logs: Log[];
    getLogs: (source: string) => (dispatch: Redux.Dispatch<any>) => void;
    params: any;
}

function mapStateToProps(state: Store.All) {
    return {
        logs: state.logs.logs
    };
}

function mapDispatchToProps(dispatch: Redux.Dispatch<any>) {
    return {
        getLogs: function (source: string) {
            dispatch(getLogs(source));
        }
    };
}

export class LogsPage extends React.Component<LogsPageProps, any> {

    componentWillMount() {
        this.props.getLogs(this.props.params);
    }

    render() {
        console.log("render");
        console.log(this.props.logs);
        return (
            <div>
                <Grid>
                    <Cell col={12}>
                        <h3>{this.props.params.source}</h3>
                    </Cell>
                </Grid>
                <Grid>
                    <p>{JSON.stringify(this.props.logs)}</p>
                </Grid>
            </div>
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LogsPage);