import * as objectAssign from "object-assign";
import * as React from "react";
// import { ReactList } from "react-list";

import Conversation from "../../models/conversation";
import ConversationList, { ConversationMap } from "../../models/conversation-list";
import ConversationListViewItem from "./ConversationListViewItem";

let ReactList = require("react-list");

export interface ConversationListViewProps {
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

    divStyle(): React.CSSProperties {
        return {
            overflow: "auto",
            paddingLeft: "0px"
        };
    }

    listStyle(): React.CSSProperties {
        return {
            marginLeft: "20px",
            marginRight: "20px"
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
        console.info("Render item " + index + " " + key);
        let conversation = this.props.conversations[index];
        return <ConversationListViewItem
            key={conversation.id}
            conversation={conversation}
            onClick={this.onClick.bind(this)}
            active={this.isConversationActive(conversation)}
            showInteractionOnActive={this.props.expandListItemWhenActive} />
    }

    render() {

        // let conversations: JSX.Element[] = [];

        // for (let conversation of this.props.conversations) {
        //     console.info("Found " + conversation.id);
        //     conversations.push((
        //         <ConversationListViewItem
        //             key={conversation.id}
        //             conversation={conversation}
        //             onClick={this.onClick.bind(this)}
        //             active={this.isConversationActive(conversation)}
        //             showInteractionOnActive={this.props.expandListItemWhenActive} />
        //     ));
        // }

        console.info("Found " + this.props.conversations.length);

        return (
            <div>
                {this.props.conversations.length > 0 ? (
                    <div style={this.divStyle()}>
                    <ReactList
                        style={this.listStyle()}
                        itemRenderer={this.renderItem.bind(this)}
                        length={this.props.conversations.length}
                        type={"uniform"}
                        useStateSize={true}/>
                    </div>
                    // <ul style={this.style()}>
                    //     {conversations}
                    // </ul>
                ) : (
                        <p> No available data </p>
                    )
                }
            </div>
        );
    }
}