import * as React from "react";

import { ConversationListView } from "../../components/ConversationListView";
import Conversation from "../../models/conversation";
import ConversationList from "../../models/conversation-list";

import browser from "../../utils/browser";
import { filter, FilterResult } from "../../utils/promise";

import { FilterType } from "./Filters";

export interface FilterableConversationListProps {
    conversations: ConversationList;
    onShowConversation: (conversation: Conversation) => void;
    filter?: FilterType;
    onItemsFiltered: (shownConversations: ConversationList) => void;
    onScroll?: (firstVsibileIndex: number, lastVisibleIndex: number, total: number) => void;
}

interface FilterableConversationListState {
    shownConversations: ConversationList;
    lastFilterType: FilterType;
}

export class FilterableConversationList extends React.Component<FilterableConversationListProps, FilterableConversationListState> {

    constructor(props: FilterableConversationListProps) {
        super(props);

        this.state = {
            shownConversations: props.conversations,
            lastFilterType: props.filter
        };
    }

    componentWillReceiveProps(nextProps: FilterableConversationListProps, nextContext: any): void {
        this.state.shownConversations = nextProps.conversations;
        this.state.lastFilterType = nextProps.filter;
        this.internalFilter(nextProps.conversations, this.state.lastFilterType);
    }

    internalFilter(list: ConversationList, filterType: FilterType) {
        let filterToUse = (filterType) ? filterType.filter : undefined;
        let me = this;
        filter(list, filterToUse)
            .then(function (result: FilterResult<Conversation>) {
                if (result.changed) {
                    let items = result.result;
                    me.state.shownConversations = items;
                    me.setState(me.state);

                    console.info("WOOO");
                    if (me.props.onItemsFiltered) {
                        me.props.onItemsFiltered(items);
                    }
                }
            }).catch(function (err: Error) {
                console.error(err);
                me.state.shownConversations = new ConversationList();
                me.setState(me.state);
            });
    }

    onConversationClicked(conversation: Conversation, event: React.MouseEvent) {
        this.props.onShowConversation(conversation);
    }

    onEmpty(): JSX.Element {
        return (<p> No available data </p>);
    }

    render() {
        return (
            <ConversationListView
                onScroll={this.props.onScroll}
                conversations={this.state.shownConversations}
                expandListItemWhenActive={browser.isMobileWidth()}
                onClick={this.onConversationClicked.bind(this)}
                onEmpty={this.onEmpty.bind(this)} />
        );
    }
}