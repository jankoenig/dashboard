import * as React from "react";

import Conversation from "../../models/conversation";
import ConversationList from "../../models/conversation-list";
import browser from "../../utils/browser";
import Noop from "../../utils/Noop";
import { filter, FilterResult } from "../../utils/promise";
import { Filter } from "./filters/Filters";
import ConvoList from "./list/ConvoList";

export interface FilterableConversationListProps {
    conversations: ConversationList;
    iconStyle?: React.CSSProperties;
    iconTooltip?: string;
    filter?: Filter<Conversation>;
    onShowConversation?: (conversation: Conversation) => void;
    onIconClick?: (conversation: Conversation) => void;
    onItemsFiltered?: (shownConversations: ConversationList) => void;
    onScroll?: (firstVsibileIndex: number, lastVisibleIndex: number, total: number) => void;
}

interface FilterableConversationListState {
    shownConversations: ConversationList;
}

export class FilterableConversationList extends React.Component<FilterableConversationListProps, FilterableConversationListState> {

    static defaultProps: FilterableConversationListProps = {
        conversations: [],
        onShowConversation: Noop,
        onItemsFiltered: Noop,
        onIconClick: Noop,
        onScroll: Noop,
        iconStyle: undefined,
        filter: undefined,
    };

    constructor(props: FilterableConversationListProps) {
        super(props);

        this.state = {
            shownConversations: props.conversations
        };

        this.onEmpty = this.onEmpty.bind(this);
    }

    componentWillReceiveProps(nextProps: FilterableConversationListProps, nextContext: any): void {
        this.state.shownConversations = nextProps.conversations;
        this.internalFilter(nextProps.conversations, nextProps.filter);
    }

    internalFilter(list: ConversationList, filterType: Filter<Conversation>) {
        let filterToUse = (filterType) ? filterType.filter : undefined;
        let me = this;
        filter(list, filterToUse)
            .then(function (result: FilterResult<Conversation>) {
                if (result.changed) {
                    let items = result.result;
                    me.state.shownConversations = items;
                    me.setState(me.state);

                    me.props.onItemsFiltered(items);
                }
            }).catch(function (err: Error) {
                me.state.shownConversations = new ConversationList();
                me.setState(me.state);
            });
    }

    onEmpty(): JSX.Element {
        return (<p> No available data </p>);
    }

    render() {
        let { onShowConversation, ...others } = this.props;
        return (
            <ConvoList
                {...others}
                conversations={this.state.shownConversations}
                expandListItemWhenActive={browser.isMobileWidth()}
                onClick={onShowConversation}
                onEmpty={this.onEmpty} />
        );
    }
}