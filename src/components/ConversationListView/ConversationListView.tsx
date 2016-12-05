import * as objectAssign from "object-assign";
import * as React from "react";
// import { ReactList } from "react-list";

import Conversation from "../../models/conversation";
import ConversationList, { ConversationMap } from "../../models/conversation-list";
import ConversationListViewItem from "./ConversationListViewItem";

// TODO: Would be nice to get this to work with typescript
let ReactList = require("react-list");

export interface ConversationListViewProps {
    readonly height: number;
    readonly conversations: ConversationList;
    readonly expandListItemWhenActive?: boolean;
    readonly onClick: (conversation: Conversation, event: React.MouseEvent) => void;
}

export interface ConversationListViewState {
    readonly activeConversations?: ConversationMap;
}

export default class ConversationListView extends React.Component<ConversationListViewProps, ConversationListViewState> {

    constructor(props: ConversationListViewProps) {
        super(props);
        this.state = {
            activeConversations: {}
        };
    }

    onClick(conversation: Conversation, event: React.MouseEvent) {
        // depending on if we in a mobile mode or not,
        // we either only let one active at a time
        // or multiple active at a time.
        let activeConversations: ConversationMap;

        if (this.props.expandListItemWhenActive) {
            // mobile mode, clone the existing
            activeConversations = objectAssign({}, this.state.activeConversations);

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

        this.setState({
            activeConversations: activeConversations
        });
        this.props.onClick(conversation, event);
    }

    isConversationActive(conversation: Conversation): boolean {
        return this.state.activeConversations[conversation.id] ? true : false;
    }

    renderItem(index: number, key: string): JSX.Element {
        let conversation = this.props.conversations[index];
        return <ConversationListViewItem
            key={conversation.id}
            conversation={conversation}
            onClick={this.onClick.bind(this)}
            active={this.isConversationActive(conversation)}
            showInteractionOnActive={this.props.expandListItemWhenActive} />;
    }

    render() {
        // "uniform" with "useState = true" is more efficient rendering, but it won't expand the list for some reason (even though it's supposed to).
        return (
            <div style={{ "height": this.props.height, "overflowY": "scroll" }}>
                    <ReactList
                        itemRenderer={this.renderItem.bind(this)}
                        length={this.props.conversations.length}
                        type={"simple"} />
            </div>
        );
    }
}