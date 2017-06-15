import * as React from "react";

import List from "../../../components/List/List";
import Conversation from "../../../models/conversation";
import ConversationList, { ConversationMap } from "../../../models/conversation-list";
import { Location } from "../../../utils/Location";
import Noop from "../../../utils/Noop";
import ConvoListItem from "./ConvoListItem";

export interface ConvoListProps {
    conversations: ConversationList;
    expandListItemWhenActive?: boolean;
    iconStyle?: React.CSSProperties;
    iconTooltip?: string;
    onClick?: (conversation: Conversation, setQueryParams: boolean) => void;
    onIconClick?: (conversatino: Conversation) => void;
    onEmpty?: () => JSX.Element;
    onScroll?: (firstVisibleItem: number, nextVisibleItem: number, total: number) => void;
}

export interface ConvoListState {
    activeConversations: ConversationMap;
}

interface ConvoListContext {
    location?: Location;
}

export class ConversationListView extends React.Component<ConvoListProps, ConvoListState> {

    context: ConvoListContext;

    static contextTypes = {
        location: React.PropTypes.object
    };

    static defaultProps: ConvoListProps = {
        conversations: [],
        expandListItemWhenActive: false,
        onClick: Noop,
        onIconClick: Noop,
        onScroll: Noop,
        onEmpty: function (): JSX.Element { return (<div />); }
    };

    constructor(props: ConvoListProps) {
        super(props);
        this.state = {
            activeConversations: {}
        };

        this.renderItem = this.renderItem.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
    }

    componentWillReceiveProps(nextProps: ConvoListProps) {
        if (nextProps &&
            nextProps.conversations &&
            nextProps.conversations.length > 0 &&
            this.context.location &&
            this.context.location.query &&
            this.context.location.query.id) {
            let activeConversations: ConversationMap = {};
            let activeConversation = nextProps.conversations[0];
            activeConversations[activeConversation.id] = activeConversation;
            this.setState({...this.state, activeConversations: { ...activeConversations }});
            this.props.onClick(activeConversation, false);
        }
    }

    handleClick(conversation: Conversation) {
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
        this.props.onClick(conversation, true);
    }

    isConversationActive(conversation: Conversation): boolean {
        return this.state.activeConversations[conversation.id] ? true : false;
    }

    handleScroll(first: number, last: number, total: number) {
        const realFirst = (first) ? first : 0;
        const realLast = (last) ? last : total;
        this.props.onScroll(realFirst, realLast, total);
    }

    renderItem(index: number, key: string): JSX.Element {
        let { onClick, expandListItemWhenActive, ...others } = this.props;

        let conversation = this.props.conversations[index];
        return (
            <ConvoListItem
                {...others}
                key={index + "." + conversation.id}
                conversation={conversation}
                onClick={this.handleClick}
                active={this.isConversationActive(conversation)}
                showInteractionOnActive={expandListItemWhenActive} />
        );
    }

    render() {
        if (this.props.conversations.length > 0) {
            let { ...others } = this.props;
            return (
                <List
                    {...others}
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

export default ConversationListView;
