import * as React from "react";
import { connect } from "react-redux";

import Log from "../../models/log";
import LogQuery from "../../models/log-query";
import Source from "../../models/source";
import { State } from "../../reducers";
import { LogMap } from "../../reducers/log";
import { CompositeFilter, DateFilter, TYPE_DATE } from "./Filters";
import LogsExplorer from "./LogsExplorer";

import { retrieveLogs } from "../../actions/log";

const LIMIT: number = 50;

export interface LogsPageProps {
    logMap: LogMap;
    source: Source;
    getLogs: (query: LogQuery) => Promise<Log[]>;
}

interface LogsPageState {
    logMap: LogMap;
    source: Source;
}

function mapStateToProps(state: State.All) {
    console.info("NEW STATE");
    console.info(state.log.logMap);
    return {
        logMap: state.log.logMap,
        source: state.source.currentSource
    };
}

function mapDispatchToProps(dispatch: Redux.Dispatch<any>) {
    return {
        getLogs: function (query: LogQuery) {
            const fetchLogs = retrieveLogs(query);
            return fetchLogs(dispatch);
        },
    };
}

export class LogsPage extends React.Component<LogsPageProps, LogsPageState> {

    constructor(props: LogsPageProps) {
        super(props);
        this.state = {
            logMap: props.logMap,
            source: props.source
        };

        this.onScroll = this.onScroll.bind(this);
        this.onFilter = this.onFilter.bind(this);
    }

    componentWillReceiveProps(props: LogsPageProps, context: any) {
        this.state.logMap = props.logMap;
        this.state.source = props.source;
        this.setState(this.state);
    }

    onFilter(filter: CompositeFilter) {
        let dateFilter = filter.getFilter(TYPE_DATE) as DateFilter;
        if (dateFilter) {
            const query = new LogQuery({
                source: this.state.source,
                startTime: dateFilter.startDate,
                endTime: dateFilter.endDate,
                limit: LIMIT
            });

            this.props.getLogs(query).then(function() {
                console.info("FILTER");
            });
        }
    }

    onScroll(firstVisibleIndex: number, lastVisibleIndex: number, total: number) {
        const allLogs = this.state.logMap[this.state.source.id].logs;
        const lastQuery = this.state.logMap[this.state.source.id].query;
        const lastLog = allLogs[allLogs.length - 1];

        if (lastVisibleIndex > total - 5) {
            const query = new LogQuery({
                source: this.state.source,
                startTime: lastQuery.startTime,
                endTime: new Date(lastLog.timestamp),
                limit: LIMIT
            });

            this.props.getLogs(query).then(function() {
                console.info("NEW PAGE");
            });
        }
    }

    render() {
        return (
            <LogsExplorer
                source={this.state.source}
                logMap={this.state.logMap}
                onFilter={this.onFilter}
                onScroll={this.onScroll} />
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LogsPage);
