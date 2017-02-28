import * as React from "react";

import Conversation from "../../../models/conversation";
import ConversationList from "../../../models/conversation-list";
import browser from "../../../utils/browser";
import { filter, FilterResult } from "../../../utils/promise";
import { Filter } from "../filters/Filters";
import ConvoList from "../list/ConvoList";

interface FilterableConversationListProps {
    conversations: ConversationList;
    iconStyle?: React.CSSProperties;
    iconTooltip?: string;
    filter?: Filter<Conversation>;
    onItemClick?: (conversation: Conversation) => void;
    onIconClick?: (conversation: Conversation) => void;
    onItemsFiltered?: (shownConversations: ConversationList) => void;
    onScroll?: (firstVsibileIndex: number, lastVisibleIndex: number, total: number) => void;
}

interface FilterableConversationListState {
    shownConversations: ConversationList;
}

export default class FilterableConversationList extends React.Component<FilterableConversationListProps, FilterableConversationListState> {

    static defaultProps: FilterableConversationListProps = {
        conversations: []
    };

    constructor(props: FilterableConversationListProps) {
        super(props);

        this.onEmpty = this.onEmpty.bind(this);

        this.state = {
            shownConversations: props.conversations
        };
    }

    componentWillReceiveProps(nextProps: FilterableConversationListProps, nextContext: any): void {
        this.internalFilter(nextProps.conversations, nextProps.filter);
    }

    internalFilter(list: ConversationList, filterType: Filter<Conversation>) {
        let filterToUse = (filterType) ? filterType.filter : undefined;
        let me = this;
        filter(list, filterToUse)
            .then(function (result: FilterResult<Conversation>) {
                let items = result.result;
                me.state.shownConversations = items;
                me.setState(me.state);
                if (result.changed) {
                    me.props.onItemsFiltered(items);
                }
            }).catch(function (err: Error) {
                me.state.shownConversations = new ConversationList();
                me.setState(me.state);
            });
    }

    onEmpty(): JSX.Element {
        return (<p> No available data </p>);
    }

    render() {
        let { onItemClick, ...others } = this.props;
        return (
            <ConvoList
                {...others}
                conversations={this.state.shownConversations}
                expandListItemWhenActive={browser.isMobileWidth()}
                onClick={onItemClick}
                onEmpty={this.onEmpty} />
        );
    }
}