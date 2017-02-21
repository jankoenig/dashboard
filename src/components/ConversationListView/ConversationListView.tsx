import * as React from "react";

import List from "../../components/List/List";
import Conversation from "../../models/conversation";
import ConversationList, { ConversationMap } from "../../models/conversation-list";
import Noop from "../../utils/Noop";
import ConversationListViewItem from "./ConversationListViewItem";

export interface ConversationListViewProps {
    readonly conversations: ConversationList;
    readonly expandListItemWhenActive?: boolean;
    readonly onClick?: (conversation: Conversation, event: React.MouseEvent) => void;
    readonly onEmpty?: () => JSX.Element;
    readonly onScroll?: (firstVisibleItem: number, nextVisibleItem: number, total: number) => void;
}

export interface ConversationListViewState {
    activeConversations?: ConversationMap;
}

export default class ConversationListView extends React.Component<ConversationListViewProps, ConversationListViewState> {

    static defaultProps: ConversationListViewProps = {
        conversations: [],
        expandListItemWhenActive: false,
        onClick: Noop,
        onScroll: Noop,
        onEmpty: function (): JSX.Element { return (<div />); }
    };

    constructor(props: ConversationListViewProps) {
        super(props);
        this.state = {
            activeConversations: {}
        };

        this.renderItem = this.renderItem.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(conversation: Conversation, event: React.MouseEvent) {
        // depending on if we in a mobile mode or not,
        // we either only let one active at a time
        // or multiple active at a time.
        let activeConversations: ConversationMap;

        if (this.props.expandListItemWhenActive) {
            // mobile mode, clone the existing
            activeConversations = { ...{}, ...this.state.activeConversations };

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

    handleScroll(first: number, last: number, total: number) {
        const realFirst = (first) ? first : 0;
        const realLast = (last) ? last : this.props.conversations.length;
        this.props.onScroll(realFirst, realLast, total);
    }

    renderItem(index: number, key: string): JSX.Element {
        let conversation = this.props.conversations[index];
        return (
            <ConversationListViewItem
                key={index + "." + conversation.id}
                conversation={conversation}
                onClick={this.handleClick}
                active={this.isConversationActive(conversation)}
                showInteractionOnActive={this.props.expandListItemWhenActive} />
        );
    }

    render() {
        if (this.props.conversations.length > 0) {
            return (
                <List
                    onScroll={this.handleScroll}
                    itemRenderer={this.renderItem}
                    length={this.props.conversations.length}
                    type={"simple"} />
            );
        } else {
            return this.props.onEmpty();
        }
    }
}