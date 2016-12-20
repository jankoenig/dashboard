import * as moment from "moment";
import * as React from "react";
import { connect } from "react-redux";

import { Cell, Grid } from "../components/Grid";
import SourceSummaryView from "../components/SourceSummaryView";
import ConversationList from "../models/conversation-list";
import ConversationListSummary from "../models/conversation-list-summary";
import Log from "../models/log";
import Source from "../models/source";
import { State } from "../reducers";
import { LogMap } from "../reducers/log";

interface SourcePageProps {
    source: Source;
    logs: Log[];
    logMap: LogMap;
}

function mapStateToProps(state: State.All) {
    return {
        logs: state.log.logs,
        logMap: state.log.logMap,
        source: state.source.currentSource
    };
}

function mapDispatchToProps(dispatch: Redux.Dispatch<any>) {
    return {
    };
}

export class SourcePage extends React.Component<SourcePageProps, any> {

    render() {

        let conversations: ConversationList;
        let conversationListSummary: ConversationListSummary;

        if (this.props.source && this.props.logMap) {
            conversations = ConversationList.fromLogs(this.props.logMap[this.props.source.id].logs);
            conversationListSummary = new ConversationListSummary(this.props.logMap[this.props.source.id].query, conversations);
        }

        return (
            <span>
                <Grid style={{ backgroundColor: "grey" }}>
                    <Cell col={12} >
                        {this.props.source ? (
                            <span>
                                <span> Project Name </span>
                                <span> {this.props.source.name} </span>
                                <span> Project ID </span>
                                <span> {this.props.source.id} </span>
                                <span> Created {moment(this.props.source.created).format("MMM Do, YYYY")} </span>
                            </span>
                        ) : undefined}
                    </Cell>
                </Grid>
                <SourceSummaryView sourceSummary={conversationListSummary} />
            </span>
        );

    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SourcePage);