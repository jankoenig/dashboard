import * as classNames from "classnames";
import * as React from "react";

import Button from "../../../components/Button";
import Interaction from "../../../components/Interaction";
import { TwoPane } from "../../../components/TwoPane";
import Conversation from "../../../models/conversation";
import ConversationList from "../../../models/conversation-list";
import Log from "../../../models/log";
import LogQuery from "../../../models/log-query";
import Source from "../../../models/source";
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
    filterBarHidden: boolean;
    selectedConvo?: Conversation;
    filter?: FilterType;
}

export default class LogExplorer extends React.Component<LogExplorerProps, LogExplorerState> {

    constructor(props: any) {
        super(props);
        this.state = {
            filterBarHidden: false
        };
    }

    componentWillReceiveProps?(nextProps: LogExplorerProps, nextContext: any): void {
        this.state.selectedConvo = undefined;
        this.setState(this.state);
    }

    onConversationClicked(conversation: Conversation) {
        this.state.selectedConvo = conversation;
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

        if (this.props.source && this.props.logMap) {
            let logMap = this.props.logMap[this.props.source.id];
            query = logMap.query;
            logs = logMap.logs;
        }

        let leftSide = (
            <FilterableConversationList
                conversations={ConversationList.fromLogs(logs)}
                filter={this.state.filter}
                onScroll={this.onScroll.bind(this)}
                onShowConversation={this.onConversationClicked.bind(this)} />
        );

        let rightSide = this.state.selectedConvo ?
            (
                <Interaction
                    request={this.state.selectedConvo.request}
                    response={this.state.selectedConvo.response}
                    outputs={this.state.selectedConvo.outputs}
                    stackTraces={this.state.selectedConvo.stackTraces} />
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