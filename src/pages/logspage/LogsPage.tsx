import * as React from "react";
import { connect } from "react-redux";

import ConversationList from "../../models/conversation-list";
import Log from "../../models/log";
import LogQuery from "../../models/log-query";
import Source from "../../models/source";
import { State } from "../../reducers";
import { LogMap, LogQueryEvent } from "../../reducers/log";
import Interval from "../../utils/Interval";
import { DateFilter, FilterType, TYPE_DATE } from "./Filters";
import LogsExplorer from "./LogsExplorer";

import { findLatest, nextPage, retrieveLogs } from "../../actions/log";

const LIMIT: number = 50;

export interface LogsPageProps {
    logMap: LogMap;
    source: Source;
    isLoading: boolean;
    getLogs: (query: LogQuery, append: boolean) => Promise<Log[]>;
    newPage: (logQueryEvent: LogQueryEvent, limit: number) => Promise<Log[]>;
    refresh: (logQueryEvent: LogQueryEvent) => Promise<Log[]>;
}

interface LogsPageState {
    lastQuery: LogQuery;
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
        newPage: function (query: LogQueryEvent, limit: number): Promise<Log[]> {
            const fetchLogs = nextPage(query, limit);
            return fetchLogs(dispatch);
        },
        refresh: function (query: LogQueryEvent): Promise<Log[]> {
            const fetchLogs = findLatest(query);
            return fetchLogs(dispatch);
        }
    };
}

export class LogsPage extends React.Component<LogsPageProps, LogsPageState> {

    refresher: Interval.Executor;

    constructor(props: LogsPageProps) {
        super(props);
        this.state = {
            lastQuery: undefined
        };

        this.onScroll = this.onScroll.bind(this);
        this.onFilter = this.onFilter.bind(this);
        this.onItemsFiltered = this.onItemsFiltered.bind(this);

        this.refresher = Interval.newExecutor(2000, this.refresh.bind(this));
    }

    componentDidMount() {
        this.enableTail();
    }

    componentWillUnmount() {
        this.disableTail();
    }

    enableTail() {
        this.refresher.start();
    }

    disableTail() {
        this.refresher.end();
    }

    onItemsFiltered(list: ConversationList) {
        if (list.length < LIMIT) {
            if (!this.props.isLoading) {
                this.getNextPage();
            }
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
            this.getNextPage();
        }
    }

    refresh() {
        console.info("REFRESHING");
        const sourceId = this.props.source.id;
        const event: LogQueryEvent = this.props.logMap[sourceId];
        this.props.refresh(event);
    }

    getNextPage() {
        console.info("Getting next");
        const sourceId = this.props.source.id;
        const event: LogQueryEvent = this.props.logMap[sourceId];
        this.props.newPage(event, LIMIT);
    }

    lastQueryDoesNotMatch(query: LogQuery) {
        return JSON.stringify(this.state.lastQuery) !== JSON.stringify(query);
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
