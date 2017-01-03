import * as React from "react";
import { connect } from "react-redux";

import Source from "../../models/source";
import { State } from "../../reducers";
import { LogMap } from "../../reducers/log";
import LogsExplorer from "./LogsExplorer";

export interface LogsPageProps {
    logMap: LogMap;
    source: Source;
    params?: any;
}

interface LogsPageState { }

function mapStateToProps(state: State.All) {
    return {
        logMap: state.log.logMap,
        source: state.source.currentSource
    };
}

export class LogsPage extends React.Component<LogsPageProps, LogsPageState> {

    render() {
        return (
            <LogsExplorer source={this.props.source} logMap={this.props.logMap} />
        );
    }
}

export default connect(
    mapStateToProps
)(LogsPage);
