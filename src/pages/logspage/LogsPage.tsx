import * as React from "react";
import { connect } from "react-redux";

// import Conversation from "../../models/conversation";
import ConversationList from "../../models/conversation-list";
import Log from "../../models/log";
import LogQuery from "../../models/log-query";
import Source from "../../models/source";
import { State } from "../../reducers";
import { LogMap } from "../../reducers/log";
import { DateFilter, FilterType, TYPE_DATE } from "./Filters";
import LogsExplorer from "./LogsExplorer";

import { retrieveLogs } from "../../actions/log";

const LIMIT: number = 50;

export interface LogsPageProps {
    logMap: LogMap;
    source: Source;
    isLoading: boolean;
    getLogs: (query: LogQuery, append: boolean) => Promise<Log[]>;
}

interface LogsPageState {
}

function mapStateToProps(state: State.All) {
    return {
        isLoading: state.log.isLoading,
        logMap: state.log.logMap,
        source: state.source.currentSource
    };
}

function mapDispatchToProps(dispatch: Redux.Dispatch<any>) {
    return {
        getLogs: function (query: LogQuery, append: boolean) {
            const fetchLogs = retrieveLogs(query, append);
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
        this.onItemsFiltered = this.onItemsFiltered.bind(this);
    }

    onItemsFiltered(list: ConversationList) {
        console.info(list.length);
        if (list.length < 50) {
            // this.getMoreItems();
        }
    }

    onFilter(filter: FilterType): boolean {
        if (filter.type === TYPE_DATE) {
            const dateFilter = filter as DateFilter;
            const query = new LogQuery({
                source: this.props.source,
                startTime: dateFilter.startDate,
                endTime: dateFilter.endDate,
                limit: LIMIT
            });

            this.props.getLogs(query, false);
            return true;
        }
        return false;
    }

    onScroll(firstVisibleIndex: number, lastVisibleIndex: number, total: number) {
        if (!this.props.isLoading && lastVisibleIndex > total - 5) {
            this.getMoreItems();
        }
    }

    getMoreItems() {
        const sourceId = this.props.source.id;
        const allLogs = this.props.logMap[sourceId].logs;

        const lastQuery = this.props.logMap[sourceId].query;
        const lastLog = allLogs[allLogs.length - 1];
        const query = new LogQuery({
            source: this.props.source,
            startTime: lastQuery.startTime,
            endTime: new Date(lastLog.timestamp),
            limit: LIMIT
        });

        this.props.getLogs(query, true);
    }

    render() {
        return (
            <LogsExplorer
                source={this.props.source}
                logMap={this.props.logMap}
                onFilter={this.onFilter}
                onScroll={this.onScroll}
                onItemsFiltered={this.onItemsFiltered} />
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LogsPage);
