import * as React from "react";

import Conversation from "../../models/conversation";
import Log from "../../models/log";
import ConversationListItem from "./ConversationListItem";

interface ConversationListProps {
    readonly logs: Log[];
    readonly onClick: (request: Log, response: Log, event: React.MouseEvent) => void;
}

interface ConversationListState {
    readonly conversations: Conversation[];
}

export default class ConversationList extends React.Component<ConversationListProps, ConversationListState> {

    getConversations(logs: Log[]): Conversation[] {
        let conversations: Conversation[] = [];
        let request: Log;
        let response: Log;

        if (logs) {
            for (let log of logs) {

                if (log.tags.indexOf("request") > -1) {
                    request = log;
                }

                if (log.tags.indexOf("response") > -1) {
                    response = log;
                }

                if (response && request) {
                    if (response.transaction_id === request.transaction_id) {
                        conversations.push(new Conversation({ request: request, response: response }));
                        request = undefined;
                        response = undefined;
                    }
                }
            }
        }

        return conversations;
    }

    constructor(props: ConversationListProps) {
        super(props);
        this.state = {
            conversations: this.getConversations(this.props.logs)
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
        this.props.onClick(conversation.request, conversation.response, event);
    }

    render() {

        let conversations: JSX.Element[] = [];

        for (let conversation of this.state.conversations) {
            conversations.push((
                <ConversationListItem
                    key={conversation.id}
                    conversation={conversation}
                    onClick={this.onClick.bind(this)} />
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