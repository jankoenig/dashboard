import * as classNames from "classnames";
import * as React from "react";

import Button from "../../../components/Button";
import Interaction from "../../../components/Interaction";
import { TwoPane } from "../../../components/TwoPane";
import Conversation from "../../../models/conversation";
import ConversationList from "../../../models/conversation-list";
import Log from "../../../models/log";
import LogQuery from "../../../models/log-query";
import Output from "../../../models/output";
import Source from "../../../models/source";
import StackTrace from "../../../models/stack-trace";
import { LogMap } from "../../../reducers/log";
import browser from "../../../utils/browser";
import { FilterableConversationList } from "../FilterableConversationList";
import { FilterBar } from "../FilterBar";
import { FilterType } from "../Filters";

const style = require("./style.scss");

interface LogExplorerProps {
    logMap: LogMap;
    source: Source;
    lockFilterBar?: boolean;
}

interface LogExplorerState {
    request: Log | undefined;
    response: Log | undefined;
    outputs: Output[];
    stackTraces: StackTrace[];
    filter?: FilterType;
    filterBarHidden: boolean;
}

export default class LogExplorer extends React.Component<LogExplorerProps, LogExplorerState> {

    constructor(props: any) {
        super(props);
        this.state = {
            request: undefined,
            response: undefined,
            outputs: [],
            stackTraces: [],
            filterBarHidden: false
        };
    }

    onConversationClicked(conversation: Conversation) {
        this.state.request = conversation.request;
        this.state.response = conversation.response;
        this.state.outputs = conversation.outputs;
        this.state.stackTraces = conversation.stackTraces;
        this.setState(this.state);
    }

    onScroll(event: React.UIEvent) {
        if (!this.state.filterBarHidden && browser.isMobileWidth() && !this.props.lockFilterBar) {
            this.state.filterBarHidden = true;
            this.setState(this.state);
        }
    }

    handleFilter(filter: FilterType) {
        this.state.filter = filter;
        this.setState(this.state);
    }

    handleFilterButtonClicked(event: React.MouseEvent) {
        this.state.filterBarHidden = !this.state.filterBarHidden;
        this.setState(this.state);
    }

    filterBarClasses() {
        return classNames(style.filterBar, {
            [style.filterBarHidden]: this.state.filterBarHidden
        });
    }

    render(): JSX.Element {

        let query: LogQuery;
        let logs: Log[];

        if (this.props.source) {
            query = this.props.logMap[this.props.source.id].query;
            logs = this.props.logMap[this.props.source.id].logs;
        }

        let leftSide = (
            <FilterableConversationList
                conversations={ConversationList.fromLogs(logs)}
                filter={this.state.filter}
                onScroll={this.onScroll.bind(this)}
                onShowConversation={this.onConversationClicked.bind(this)} />
        );

        let rightSide = this.state.request ?
            (
                <Interaction
                    request={this.state.request}
                    response={this.state.response}
                    outputs={this.state.outputs}
                    stackTraces={this.state.stackTraces} />
            ) : (
                <h6> Select a log to view </h6>
            );

        return (
            <span>
                <FilterBar className={this.filterBarClasses()} onFilter={this.handleFilter.bind(this)} query={query} />
                <TwoPane
                    leftStyle={{ paddingLeft: "10px", paddingRight: "5px", zIndex: 1 }}
                    rightStyle={{ paddingLeft: "5px", paddingRight: "10px" }}
                    spacing={true}>
                    {leftSide}
                    {rightSide}
                </TwoPane>
                {this.state.filterBarHidden ? (
                    <Button
                        className={style.button}
                        fab
                        colored
                        onClick={this.handleFilterButtonClicked.bind(this)}>
                        <i className="material-icons">filter_list</i>
                    </Button>
                ) : undefined}
            </span>
        );
    }
}