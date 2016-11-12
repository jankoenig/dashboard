import * as React from "react";

import Conversation from "../../models/conversation";
import Log from "../../models/log";
import Output from "../../models/output";
import ConversationListItem from "./ConversationListItem";

class MutableConversation {
    request: Log;
    response: Log;
    outputs: Output[] = [];
}

interface ConversationListProps {
    readonly logs: Log[];
    readonly onClick: (conversation: Conversation, event: React.MouseEvent) => void;
}

interface ConversationListState {
    readonly conversations: Conversation[];
    readonly activeConversation?: Conversation;
}

export default class ConversationList extends React.Component<ConversationListProps, ConversationListState> {

    // TODO: This logic should go somewhere else outside of this component.
    //  The property shoudl then change from a list of logs to a list of conversations
    getConversations(logs: Log[]): Conversation[] {

        let conversations: Conversation[] = [];
        let conversationMap: { [transaction_id: string]: MutableConversation } = {};

        if (logs) {
            for (let log of logs) {

                // First make sure the map has an object there
                if (!conversationMap[log.transaction_id]) {
                    conversationMap[log.transaction_id] = new MutableConversation();
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
            activeConversation: undefined
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
        this.setState({
            conversations: this.state.conversations,
            activeConversation: conversation
        });
        this.props.onClick(conversation, event);
    }

    isConversationActive(conversation: Conversation) {
        if (this.state.activeConversation) {
            return this.state.activeConversation.id === conversation.id;
        }

        return false;
    }

    render() {

        let conversations: JSX.Element[] = [];

        for (let conversation of this.state.conversations) {
            conversations.push((
                <ConversationListItem
                    key={conversation.id}
                    conversation={conversation}
                    onClick={this.onClick.bind(this)}
                    active={this.isConversationActive(conversation)} />
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