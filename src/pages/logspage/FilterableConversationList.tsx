import * as React from "react";

import { ConversationListView } from "../../components/ConversationListView";
import Conversation from "../../models/conversation";
import ConversationList from "../../models/conversation-list";

import browser from "../../utils/browser";
import { filter } from "../../utils/promise-utils";

import { FilterType } from "./Filters";
import { LogsFilterComponent } from "./LogsFilterComponent";


export interface FilterableConversationListProps {
    listHeight?: number;
    conversations: ConversationList;
    onShowConversation: (conversation: Conversation) => void;
}

interface FilterableConversationListState {
    shownConversations: ConversationList;
}

export class FilterableConversationList extends React.Component<FilterableConversationListProps, FilterableConversationListState> {

    lastFilterType: FilterType;

    constructor(props: FilterableConversationListProps) {
        super(props);
        console.info("Length + " + props.conversations.length);
        this.state = {
            shownConversations: props.conversations
        };
    }

    componentWillReceiveProps(nextProps: FilterableConversationListProps, nextContext: any): void {
        this.state.shownConversations = nextProps.conversations;
        this.internalFilter(nextProps.conversations, this.lastFilterType);
    }

    onFilter(filterType: FilterType) {
        this.lastFilterType = filterType;
        this.internalFilter(this.props.conversations, this.lastFilterType);
    }

    internalFilter(list: ConversationList, filterType: FilterType) {
        let filterToUse = (filterType) ? filterType.filter : undefined;
        let me = this;
        filter(list, filterToUse)
            .then(function (items: ConversationList) {
                console.info("FOUND items.length " + items.length);
                me.state.shownConversations = items;
                me.setState(me.state);
            }).catch(function (err: Error) {
                console.info("NOTHING FOUND " + err.message);
                me.state.shownConversations = [];
                me.setState(me.state);
            });
    }

    onConversationClicked(conversation: Conversation, event: React.MouseEvent) {
        this.props.onShowConversation(conversation);
    }

    render() {
        return (
            <div>
                <LogsFilterComponent onFilter={this.onFilter.bind(this)} />
                    <ConversationListView
                        conversations={this.state.shownConversations}
                        expandListItemWhenActive={browser.isMobileWidth()}
                        onClick={this.onConversationClicked.bind(this)} />
            </div>
        );
    }
}