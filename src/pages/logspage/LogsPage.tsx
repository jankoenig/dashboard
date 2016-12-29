import * as React from "react";
import { connect } from "react-redux";

import Source from "../../models/source";
import { State } from "../../reducers";
import { LogMap } from "../../reducers/log";

import LogExplorer from "../../components/LogsExplorer";

export interface LogsPageProps {
    logMap: LogMap;
    source: Source;
    params?: any;
}

interface LogsPageState {

}

function mapStateToProps(state: State.All) {
    return {
        logMap: state.log.logMap,
        source: state.source.currentSource
    };
}

function mapDispatchToProps(dispatch: Redux.Dispatch<any>) {
    return {
    };
}

export class LogsPage extends React.Component<LogsPageProps, LogsPageState> {

    render() {
        return (
            <LogExplorer source={this.props.source} logMap={this.props.logMap} />
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LogsPage);