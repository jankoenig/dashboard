import * as React from "react";

import ERROR from "../../constants/error";

import { ConversationListView } from "../../components/ConversationListView";
import Conversation from "../../models/conversation";
import ConversationList from "../../models/conversation-list";

import browser from "../../utils/browser";
import { filter } from "../../utils/promise";

import { FilterType } from "./Filters";

export interface FilterableConversationListProps {
    height: number;
    conversations: ConversationList;
    onShowConversation: (conversation: Conversation) => void;
    filter?: FilterType;
}

interface Dimensions {
    width: number;
    height: number;
}

interface FilterableConversationListState {
    shownConversations: ConversationList;
    lastFilterType: FilterType;
}

export class FilterableConversationList extends React.Component<FilterableConversationListProps, FilterableConversationListState> {

    root: HTMLElement;

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
            .then(function (items: ConversationList) {
                me.state.shownConversations = items;
                me.setState(me.state);
            }).catch(function (err: Error) {
                // only print out errors that are NOT the no items found error
                if (err.message !== ERROR.FILTER.NO_ITEMS_FOUND) {
                    console.error(err);
                }
                me.state.shownConversations = new ConversationList();
                me.setState(me.state);
            });
    }

    onConversationClicked(conversation: Conversation, event: React.MouseEvent) {
        this.props.onShowConversation(conversation);
    }

    onEmpty(): JSX.Element {
        return (<p> No available data </p> );
    }

    handleRoot(root: HTMLElement) {
        this.root = root;
    }

    render() {
        let listHeight = this.props.height;
        return (
            <div ref={this.handleRoot.bind(this)} style={{ overflowY: "hidden" }}>
                <div>
                    <ConversationListView
                        height={listHeight}
                        conversations={this.state.shownConversations}
                        expandListItemWhenActive={browser.isMobileWidth()}
                        onClick={this.onConversationClicked.bind(this)}
                        onEmpty={this.onEmpty.bind(this)} />
                </div>
            </div>
        );
    }
}