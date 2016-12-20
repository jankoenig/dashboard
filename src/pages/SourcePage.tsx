import * as moment from "moment";
import * as React from "react";
import { connect } from "react-redux";

import FormInput from "../components/FormInput";
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
                {this.props.source ? (
                    <Grid style={{ backgroundColor: "rgb(36, 48, 54)" }}>
                        <Cell col={3} >
                            <FormInput
                                theme={{ inputTextColor: "#ECEFF1" }}
                                type={"text"}
                                value={this.props.source.name}
                                label={"Name"}
                                floatingLabel={true}
                                autoComplete={"off"}
                                readOnly={true} />
                        </Cell>
                        <Cell col={3} >
                            <FormInput
                                theme={{ inputTextColor: "#ECEFF1" }}
                                type={"text"}
                                value={this.props.source.id}
                                label={"ID"}
                                floatingLabel={true}
                                autoComplete={"off"}
                                readOnly={true} />
                        </Cell>
                        <Cell col={3} >
                            <FormInput
                                theme={{ inputTextColor: "#ECEFF1" }}
                                type={"text"}
                                value={moment(this.props.source.created).format("MMM Do, YYYY")}
                                label={"Created"}
                                floatingLabel={true}
                                autoComplete={"off"}
                                readOnly={true} />
                        </Cell>
                        <Cell col={3} >
                            <FormInput
                                theme={{ inputTextColor: "#ECEFF1" }}
                                type={"password"}
                                value={this.props.source.secretKey}
                                label={"Secret Key"}
                                floatingLabel={true}
                                autoComplete={"off"}
                                readOnly={true}
                                showable={true} />
                        </Cell>
                    </Grid>
                ) : undefined}
                <SourceSummaryView sourceSummary={conversationListSummary} />
            </span>
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SourcePage);