import * as objectAssign from "object-assign";
import * as React from "react";

import Conversation from "../../models/conversation";
import ConversationList, { ConversationMap } from "../../models/conversation-list";
import ConversationListViewItem from "./ConversationListViewItem";

interface ConversationListViewProps {
    readonly conversations: ConversationList;
    readonly expandListItemWhenActive?: boolean;
    readonly onClick: (conversation: Conversation, event: React.MouseEvent) => void;
}

interface ConversationListViewState {
    readonly activeConversations?: ConversationMap;
}

export default class ConversationListView extends React.Component<ConversationListViewProps, ConversationListViewState> {

    constructor(props: ConversationListViewProps) {
        super(props);
        this.state = {
            activeConversations: {}
        };
    }

    style(): React.CSSProperties {
        return {
            listStyle: "none",
            paddingLeft: "0px"
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

    render() {

        let conversations: JSX.Element[] = [];

        for (let conversation of this.props.conversations) {
            conversations.push((
                <ConversationListViewItem
                    key={conversation.id}
                    conversation={conversation}
                    onClick={this.onClick.bind(this)}
                    active={this.isConversationActive(conversation)}
                    showInteractionOnActive={this.props.expandListItemWhenActive} />
            ));
        }

        return (
            <div>
                {conversations.length > 0 ? (
                    <ul style={this.style()}>
                        {conversations}
                    </ul>
                ) : (
                        <p> No available data </p>
                    )
                }
            </div>
        );
    }
}