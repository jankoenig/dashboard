import * as React from "react";
import { connect } from "react-redux";

import { findLatest, nextPage, PageResults, retrieveLogs } from "../../actions/log";
import Conversation from "../../models/conversation";
import ConversationList from "../../models/conversation-list";
import Log from "../../models/log";
import LogQuery from "../../models/log-query";
import Source from "../../models/source";
// import Noop from "../../../utils/Noop";
import { State } from "../../reducers";
import { LogQueryEvent } from "../../reducers/log";
import { DateFilter } from "./filters/ConvoFilters";
import { CompositeFilter } from "./filters/Filters";
import ConvoList from "./list/FilterableConvoList";

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
    // iconStyle?: React.CSSProperties;
    // iconTooltip?: string;
    // filter?: Filter<Conversation>;
    // onItemClick?: (conversation: Conversation) => void;
    // onIconClick?: (conversation: Conversation) => void;
    // onItemsFiltered?: (shownConversations: ConversationList) => void;
    // onScroll?: (firstVsibileIndex: number, lastVisibleIndex: number, total: number) => void;
}

interface ConvoListPageState {
    conversations: ConversationList;
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
        range = {...{startTime: dateFilter.startDate, endTime: dateFilter.endDate }};
    }
    return range;
}

export class ConvoListPage extends React.Component<ConvoListPageProps, ConvoListPageState> {

    constructor(props: ConvoListPageProps) {
        super(props);

        this.state = {
            conversations: []
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
        .then(ConversationList.fromLogs)
        .then((conversations: ConversationList) => {
            console.info("SETTING LIST " + conversations.length);
            this.setState({ conversations: conversations });
        });
    }

    render() {
        let { ...others } = this.props;
        console.info("RENDER");
        return (
            <ConvoList
                {...others}
                conversations={this.state.conversations}
            />
        );
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ConvoListPage);