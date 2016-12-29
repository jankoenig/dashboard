import * as React from "react";
import { connect } from "react-redux";

import Interaction from "../../components/Interaction";
import { TwoPane } from "../../components/TwoPane";
import Conversation from "../../models/conversation";
import ConversationList from "../../models/conversation-list";
import Log from "../../models/log";
import Output from "../../models/output";
import Source from "../../models/source";
import StackTrace from "../../models/stack-trace";
import { State } from "../../reducers";
import { FilterableConversationList } from "./FilterableConversationList";
import { FilterBar } from "./FilterBar";
import { FilterType } from "./Filters";

export interface LogsPageProps {
    logs: Log[];
    source: Source;
    params?: any;
}

interface LogsPageState {
    request: Log | undefined;
    response: Log | undefined;
    outputs: Output[];
    stackTraces: StackTrace[];
    filter?: FilterType;
}

function mapStateToProps(state: State.All) {
    return {
        logs: state.log.logs,
        source: state.source.currentSource
    };
}

export class LogsPage extends React.Component<LogsPageProps, LogsPageState> {

    constructor(props: LogsPageProps) {
        super(props);
        this.state = {
            request: undefined,
            response: undefined,
            outputs: [],
            stackTraces: []
        };
    }

    onConversationClicked(conversation: Conversation) {
        this.state.request = conversation.request;
        this.state.response = conversation.response;
        this.state.outputs = conversation.outputs;
        this.state.stackTraces = conversation.stackTraces;
        this.setState(this.state);
    }

    handleFilter(filter: FilterType) {
        this.state.filter = filter;
        this.setState(this.state);
    }

    render() {
        let leftSide = (
            <FilterableConversationList
                conversations={ConversationList.fromLogs(this.props.logs)}
                filter={this.state.filter}
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
                <FilterBar onFilter={this.handleFilter.bind(this)} />
                <TwoPane
                    leftStyle={{ paddingLeft: "10px", paddingRight: "5px" }}
                    rightStyle={{ paddingLeft: "5px", paddingRight: "10px" }}
                    spacing={true}>
                    {leftSide}
                    {rightSide}
                </TwoPane>
            </span>
        );
    }
}

export default connect(
    mapStateToProps
)(LogsPage);
