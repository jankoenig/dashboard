import * as React from "react";

import { ConversationListView } from "../../components/ConversationListView";
import Conversation from "../../models/conversation";
import ConversationList from "../../models/conversation-list";

import browser from "../../utils/browser";
import { filter } from "../../utils/promise-utils";

import { FilterType } from "./Filters";
import { LogsFilterComponent } from "./LogsFilterComponent";


export interface FilterableConversationListProps {
    height: number;
    conversations: ConversationList;
    onShowConversation: (conversation: Conversation) => void;
}

interface Dimensions {
    width: number;
    height: number;
}

interface FilterableConversationListState {
    shownConversations: ConversationList;
}

export class FilterableConversationList extends React.Component<FilterableConversationListProps, FilterableConversationListState> {

    root: HTMLElement;
    filterDiv: HTMLElement;
    lastFilterType: FilterType;

    constructor(props: FilterableConversationListProps) {
        super(props);

        this.state = {
            shownConversations: props.conversations,
        };
    }

    componentWillReceiveProps(nextProps: FilterableConversationListProps, nextContext: any): void {
        this.state.shownConversations = nextProps.conversations;
        this.internalFilter(nextProps.conversations, this.lastFilterType);
    }

    onFilter(filterType: FilterType) {
        this.lastFilterType = filterType;
        this.internalFilter(this.props.conversations, this.lastFilterType);
    }

    internalFilter(list: ConversationList, filterType: FilterType) {
        let filterToUse = (filterType) ? filterType.filter : undefined;
        let me = this;
        filter(list, filterToUse)
            .then(function (items: ConversationList) {
                me.state.shownConversations = items;
                me.setState(me.state);
            }).catch(function (err: Error) {
                me.state.shownConversations = [];
                me.setState(me.state);
            });
    }

    getFilterComponentHeight(): number {
        if (this.filterDiv) {
            let filterRect = this.filterDiv.getBoundingClientRect();
            return filterRect.height;
        } else {
            return 200;
        }
    }

    onConversationClicked(conversation: Conversation, event: React.MouseEvent) {
        this.props.onShowConversation(conversation);
    }

    onEmpty(): JSX.Element {
        return (<p> No available data </p> );
    }

    handleRoot(root: HTMLElement) {
        this.root = root;
    }

    handleFilterDiv(filterDiv: HTMLElement) {
        this.filterDiv = filterDiv;
    }

    render() {
        let listHeight = this.props.height - this.getFilterComponentHeight();
        return (
            <div ref={this.handleRoot.bind(this)} style={{ overflowY: "hidden" }}>
                <div ref={this.handleFilterDiv.bind(this)} >
                    <LogsFilterComponent onFilter={this.onFilter.bind(this)} />
                </div>
                <div>
                    <ConversationListView
                        height={listHeight}
                        conversations={this.state.shownConversations}
                        expandListItemWhenActive={browser.isMobileWidth()}
                        onClick={this.onConversationClicked.bind(this)}
                        onEmpty={this.onEmpty.bind(this)} />
                </div>
            </div>
        );
    }
}