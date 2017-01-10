import * as React from "react";
import { connect } from "react-redux";

import Log from "../../models/log";
import LogQuery from "../../models/log-query";
import Source from "../../models/source";
import { State } from "../../reducers";
import { LogMap } from "../../reducers/log";
import { CompositeFilter, DateFilter, TYPE_DATE } from "./Filters";
import LogsExplorer from "./LogsExplorer";

import LogService from "../../services/log";

export interface LogsPageProps {
    logMap: LogMap;
    source: Source;
}

interface LogsPageState {
    logMap: LogMap;
    source: Source;
}

function mapStateToProps(state: State.All) {
    return {
        logMap: state.log.logMap,
        source: state.source.currentSource
    };
}

export class LogsPage extends React.Component<LogsPageProps, LogsPageState> {

    constructor(props: LogsPageProps) {
        super(props);
        this.state = {
            logMap: props.logMap,
            source: props.source
        };
    }

    componentWillReceiveProps(props: LogsPageProps, context: any) {
        this.state.logMap = props.logMap;
        this.state.source = props.source;
        this.setState(this.state);
    }

    onFilter(filter: CompositeFilter) {
        console.info("On filter " + filter.type);
        let dateFilter = filter.getFilter(TYPE_DATE) as DateFilter;
        if (dateFilter) {
            console.info("Querying new date");
            const query = new LogQuery({
                source: this.state.source,
                startTime: dateFilter.startDate,
                endTime: dateFilter.endDate
            });
            const sourceId = this.state.source.id;

            LogService.getLogs(query).then((value: Log[]) => {
                console.info("New logs " + value.length);
                this.state.logMap = {
                    [sourceId]: {
                        logs: value,
                        query: query
                    }
                };
                this.setState(this.state);
            });
        }
    }

    render() {
        return (
            <LogsExplorer source={this.state.source} logMap={this.state.logMap} onFilter={this.onFilter.bind(this)} />
        );
    }
}

export default connect(
    mapStateToProps
)(LogsPage);
