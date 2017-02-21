import * as React from "react";
import { connect } from "react-redux";

import ConversationList from "../../models/conversation-list";
import Log from "../../models/log";
import LogQuery from "../../models/log-query";
import Source from "../../models/source";
import { State } from "../../reducers";
import { LogMap, LogQueryEvent } from "../../reducers/log";
import { DateFilter, FilterType, TYPE_DATE } from "./Filters";
import LogsExplorer from "./LogsExplorer";

import { findLatest, nextPage, PageResults, retrieveLogs } from "../../actions/log";

const LIMIT: number = 50;

export interface LogsPageProps {
    logMap: LogMap;
    source: Source;
    isLoading: boolean;
    getLogs: (query: LogQuery, append: boolean) => Promise<Log[]>;
    newPage: (logQueryEvent: LogQueryEvent, limit: number) => Promise<PageResults>;
    refresh: (logQueryEvent: LogQueryEvent) => Promise<PageResults>;
}

interface LogsPageState {
    endReached?: boolean;
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
        newPage: function (query: LogQueryEvent, limit: number): Promise<PageResults> {
            const fetchLogs = nextPage(query, limit);
            return fetchLogs(dispatch);
        },
        refresh: function (query: LogQueryEvent): Promise<PageResults> {
            const fetchLogs = findLatest(query);
            return fetchLogs(dispatch);
        }
    };
}

export class LogsPage extends React.Component<LogsPageProps, LogsPageState> {

    constructor(props: LogsPageProps) {
        super(props);
        this.state = {
        };

        this.onScroll = this.onScroll.bind(this);
        this.onFilter = this.onFilter.bind(this);
        this.onItemsFiltered = this.onItemsFiltered.bind(this);
        this.refresh = this.refresh.bind(this);
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
        const event: LogQueryEvent = this.getLogQueryEvent();
        if (event) {
            this.props.refresh(event);
        }
    }

    getNextPage() {
        if (!this.state.endReached) {
            const event: LogQueryEvent = this.getLogQueryEvent();
            if (event) {
                this.props.newPage(event, LIMIT).then((results: PageResults) => {
                    if (results.newLogs.length === 0) {
                        this.state.endReached = true;
                        this.setState(this.state);
                    }
                });
            }
        }
    }

    getLogQueryEvent(): LogQueryEvent | undefined {
        if (this.props.source) {
            if (this.props.logMap) {
                return this.props.logMap[this.props.source.id];
            }
        }
        return undefined;
    }

    render() {
        return (
            <LogsExplorer
                source={this.props.source}
                logMap={this.props.logMap}
                onFilter={this.onFilter}
                onScroll={this.onScroll}
                onItemsFiltered={this.onItemsFiltered}
                onGetNewLogs={this.refresh} />
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LogsPage);