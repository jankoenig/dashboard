import * as objectAssign from "object-assign";
import * as React from "react";

import Conversation, { ConversationProperties } from "../../models/conversation";
import Log from "../../models/log";
import Output from "../../models/output";
import ConversationListItem from "./ConversationListItem";

type ConversationMap = { [id: string]: ConversationProperties }

interface ConversationListProps {
    readonly logs: Log[];
    readonly expandListItemWhenActive?: boolean;
    readonly onClick: (conversation: Conversation, event: React.MouseEvent) => void;
}

interface ConversationListState {
    readonly conversations: Conversation[];
    readonly activeConversations?: ConversationMap;
}

export default class ConversationList extends React.Component<ConversationListProps, ConversationListState> {

    // TODO: This logic should go somewhere else outside of this component.
    // The property should then change from a list of logs to a list of conversations
    getConversations(logs: Log[]): Conversation[] {

        let conversations: Conversation[] = [];
        let conversationMap: ConversationMap = {};

        if (logs) {
            for (let log of logs) {

                // First make sure the map has an object there
                if (!conversationMap[log.transaction_id]) {
                    conversationMap[log.transaction_id] = { request: undefined, response: undefined, outputs: [] };
                }

                if (log.tags && log.tags.indexOf("request") > -1) {
                    conversationMap[log.transaction_id].request = log;
                }

                if (log.tags && log.tags.indexOf("response") > -1) {
                    conversationMap[log.transaction_id].response = log;
                }

                if (typeof log.payload === "string") {
                    conversationMap[log.transaction_id].outputs.push(Output.fromLog(log));
                }
            }

            // convert to an array
            conversations = Object.keys(conversationMap).map(function (key) {
                return new Conversation(conversationMap[key]);
            });
        }

        return conversations;
    }

    constructor(props: ConversationListProps) {
        super(props);
        this.state = {
            conversations: this.getConversations(this.props.logs),
            activeConversations: {}
        };
    }

    componentWillReceiveProps(nextProps: ConversationListProps, nextContext: any) {
        this.setState({
            conversations: this.getConversations(nextProps.logs)
        });
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
            conversations: this.state.conversations,
            activeConversations: activeConversations
        });
        this.props.onClick(conversation, event);
    }

    isConversationActive(conversation: Conversation): boolean {
        return this.state.activeConversations[conversation.id] ? true : false;
    }

    render() {

        let conversations: JSX.Element[] = [];

        for (let conversation of this.state.conversations) {
            conversations.push((
                <ConversationListItem
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