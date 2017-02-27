import * as React from "react";
import { connect } from "react-redux";

import { findLatest, nextPage, PageResults, retrieveLogs } from "../../actions/log";
import Conversation from "../../models/conversation";
import ConversationList from "../../models/conversation-list";
import Log from "../../models/log";
import LogQuery from "../../models/log-query";
import Source from "../../models/source";
import { State } from "../../reducers";
import { LogQueryEvent } from "../../reducers/log";
import { DateFilter } from "./filters/ConvoFilters";
import { CompositeFilter } from "./filters/Filters";
import ConvoList from "./list/FilterableConvoList";

const LIMIT: number = 50;

interface DateRange {
    startTime?: Date;
    endTime?: Date;
}

interface ConvoListPageProps {
    isLoading: boolean;
    source: Source;
    getLogs: (query: LogQuery) => Promise<Log[]>;
    newPage: (logQueryEvent: LogQueryEvent, limit: number) => Promise<PageResults>;
    refresh: (logQueryEvent: LogQueryEvent) => Promise<PageResults>;
    filter?: CompositeFilter<Conversation>;
    iconStyle?: React.CSSProperties;
    iconTooltip?: string;
    onItemClick?: (conversation: Conversation) => void;
    onIconClick?: (conversation: Conversation) => void;
}

interface ConvoListPageState {
    query: LogQuery;
    lastLogs: Log[];
    conversations: ConversationList;
    endReached: boolean;
}

function mapStateToProps(state: State.All) {
    return {
        isLoading: state.log.isLoading,
        source: state.source.currentSource
    };
}

function mapDispatchToProps(dispatch: Redux.Dispatch<any>) {
    return {
        getLogs: function (query: LogQuery): Promise<Log[]> {
            const fetchLogs = retrieveLogs(query, false);
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

function getDateRange(filter: CompositeFilter<any>): DateRange {
    let range: DateRange = {};
    const dateFilter = (filter) ? filter.getFilter(DateFilter.type) as DateFilter : undefined;
    if (dateFilter) {
        range = { ...{ startTime: dateFilter.startDate, endTime: dateFilter.endDate } };
    }
    return range;
}

export class ConvoListPage extends React.Component<ConvoListPageProps, ConvoListPageState> {

    constructor(props: ConvoListPageProps) {
        super(props);

        this.handleItemsFiltered = this.handleItemsFiltered.bind(this);
        this.handleScroll = this.handleScroll.bind(this);

        this.state = {
            conversations: [],
            lastLogs: [],
            endReached: false,
            query: undefined
        };
    }

    componentWillMount() {
        const range = getDateRange(this.props.filter);
        const query: LogQuery = new LogQuery({
            source: this.props.source,
            startTime: range.startTime,
            endTime: range.endTime,
            limit: 50
        });

        this.props.getLogs(query)
            .then((logs: Log[]) => {
                const conversations = ConversationList.fromLogs(logs);
                this.setState({ conversations: conversations, query: query, lastLogs: logs, endReached: false });
            });
    }

    handleItemsFiltered(shownItems: ConversationList) {
        if (!this.props.isLoading && !this.state.endReached && shownItems.length < LIMIT) {
            this.getNextPage();
        }
    }

    handleScroll(firstVisibleIndex: number, lastVisibleIndex: number, totalCount: number) {
        if (!this.props.isLoading && !this.state.endReached && totalCount - lastVisibleIndex < 5) {
            this.getNextPage();
        }
    }

    getNextPage() {
        this.props.newPage({ query: this.state.query, logs: this.state.lastLogs }, 50)
            .then((result: PageResults) => {
                const endReached = result.newLogs.length === 0;
                if (endReached) {
                    // The reason we can't just append right now is because we may have partial conversations from the previous batch.
                    const newConversations = ConversationList.fromLogs(result.totalLogs);
                    this.state.conversations = this.state.conversations.concat(newConversations);
                    this.state.lastLogs = result.totalLogs;
                }
                this.state.endReached = endReached;
                this.setState(this.state);
            });
    }

    getRefresh() {
        this.props.refresh({ query: this.state.query, logs: this.state.lastLogs })
            .then((result: PageResults) => {
                if (result.newLogs.length > 0) {
                    // The reason we can't just preppend right now is because we may have partial conversations from the previous batch.
                    const newConversations = ConversationList.fromLogs(result.totalLogs);
                    this.state.conversations = this.state.conversations.concat(newConversations);
                    this.state.lastLogs = result.totalLogs;
                    this.setState(this.state);
                }
            });
    }

    render() {
        let { ...others } = this.props;
        return (
            <ConvoList
                {...others}
                onScroll={this.handleScroll}
                onItemsFiltered={this.handleItemsFiltered}
                conversations={this.state.conversations}
            />
        );
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ConvoListPage);