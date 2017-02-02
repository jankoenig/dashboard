import * as React from "react";

import List, { ListType } from "../../components/List/List";
import Conversation from "../../models/conversation";
import ConversationList, { ConversationMap } from "../../models/conversation-list";
import ConversationListViewItem from "./ConversationListViewItem";

export interface ConversationListViewProps {
    readonly conversations: ConversationList;
    readonly expandListItemWhenActive?: boolean;
    readonly onClick: (conversation: Conversation, event: React.MouseEvent) => void;
    readonly onEmpty?: () => JSX.Element;
    readonly onScroll?: (firstVisibleItem: number, nextVisibleItem: number, total: number) => void;
}

export interface ConversationListViewState {
    activeConversations?: ConversationMap;
    listType?: ListType;
}

export default class ConversationListView extends React.Component<ConversationListViewProps, ConversationListViewState> {

    constructor(props: ConversationListViewProps) {
        super(props);
        this.state = {
            activeConversations: {},
            listType: "uniform"
        };
    }

    onClick(conversation: Conversation, event: React.MouseEvent) {
        // depending on if we in a mobile mode or not,
        // we either only let one active at a time
        // or multiple active at a time.
        let activeConversations: ConversationMap;

        if (this.props.expandListItemWhenActive) {
            // mobile mode, clone the existing
            activeConversations = {...{}, ...this.state.activeConversations};

            if (activeConversations[conversation.id]) {
                // if it exists remove it
                delete activeConversations[conversation.id];
            } else {
                // otherwise add it
                activeConversations[conversation.id] = conversation;
            }
        } else {
            // we don't care about the previous ones active
            // just add it to a new map
            activeConversations = { [conversation.id]: conversation };
        }

        this.state.activeConversations = activeConversations;
        this.setState(this.state);
        this.props.onClick(conversation, event);
    }

    isConversationActive(conversation: Conversation): boolean {
        return this.state.activeConversations[conversation.id] ? true : false;
    }

    renderItem(index: number, key: string): JSX.Element {
        let conversation = this.props.conversations[index];
        return (
            <ConversationListViewItem
                key={index + "." + conversation.id}
                conversation={conversation}
                onClick={this.onClick.bind(this)}
                active={this.isConversationActive(conversation)}
                showInteractionOnActive={this.props.expandListItemWhenActive} />
        );
    }

    render() {
        const emptyElement = (this.props.onEmpty) ? this.props.onEmpty() : (<div />);
        const listType = this.props.expandListItemWhenActive ? "variable" : "uniform";

        let listElement = (
            <List
                onScroll={this.props.onScroll}
                itemRenderer={this.renderItem.bind(this)}
                length={this.props.conversations.length}
                type={listType} />
        );

        let finalElement = this.props.conversations.length > 0 ? listElement : emptyElement;

        return finalElement;
    }
}