import * as moment from "moment";
import * as React from "react";
import { connect } from "react-redux";
import { Link } from "react-router";

import Button from "../components/Button";
import DataTile from "../components/DataTile";
import { Cell, Grid } from "../components/Grid";
import SourceSummaryView from "../components/SourceSummaryView";
import ConversationList from "../models/conversation-list";
import ConversationListSummary from "../models/conversation-list-summary";
import Source from "../models/source";
import { State } from "../reducers";
import { LogMap } from "../reducers/log";

interface SourcePageProps {
    source: Source;
    logMap: LogMap;
}

function mapStateToProps(state: State.All) {
    return {
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
                    <span>
                        <Grid style={{ backgroundColor: "rgb(36, 48, 54)", paddingBottom: "0px", paddingTop: "0px"}}>
                            <Cell col={3} hidePhone={true}>
                                <DataTile
                                    theme={{ inputTextColor: "#ECEFF1" }}
                                    value={this.props.source.name}
                                    label={"Name"} />
                            </Cell>
                            <Cell col={3} hidePhone={true} >
                                <DataTile
                                    theme={{ inputTextColor: "#ECEFF1" }}
                                    value={this.props.source.id}
                                    label={"ID"} />
                            </Cell>
                            <Cell col={3} hidePhone={true} >
                                <DataTile
                                    theme={{ inputTextColor: "#ECEFF1" }}
                                    value={moment(this.props.source.created).format("MMM Do, YYYY")}
                                    label={"Created"} />
                            </Cell>
                            <Cell col={3} hidePhone={true} >
                                <DataTile
                                    theme={{ inputTextColor: "#ECEFF1" }}
                                    value={this.props.source.secretKey}
                                    label={"Secret Key"}
                                    hidden={true}
                                    showable={true} />
                            </Cell>
                        </Grid>
                        <Grid>
                            <Cell col={3}>
                                <p style={{ fontSize: "16px", fontFamily: "Roboto, Helvetica"}}>What would you like to do? </p>
                            </Cell>
                            <Cell col={3}>
                                <Link to={"/skills/" + this.props.source.id + "/logs"}>
                                <Button raised={true} ripple={true}>View Logs</Button>
                                </Link>
                            </Cell>
                        </Grid>
                    </span>
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