import * as React from "react";
import { connect } from "react-redux";

import { getLogs } from "../actions/log";
import { ConversationListView } from "../components/ConversationListView";
import { Cell, Grid } from "../components/Grid";
import Interaction from "../components/Interaction";
import Conversation from "../models/conversation";
import ConversationList from "../models/conversation-list";
import Log from "../models/log";
import Output from "../models/output";
import Source from "../models/source";
import { State } from "../reducers";
import browser from "../utils/browser";

export interface LogsPageProps {
    logs: Log[];
    source: Source;
    getLogs: (source: string) => (dispatch: Redux.Dispatch<any>) => void;
    params?: any;
}

export interface LogsPageState {
    width: number;
    height: number;
    source: Source | undefined;
    request: Log | undefined;
    response: Log | undefined;
    outputs: Output[];
}

function mapStateToProps(state: State.All) {
    return {
        logs: state.log.logs,
        source: state.source.currentSource
    };
}

function mapDispatchToProps(dispatch: Redux.Dispatch<any>) {
    return {
        getLogs: function (source: string) {
            dispatch(getLogs(source));
        }
    };
}

export class LogsPage extends React.Component<LogsPageProps, LogsPageState> {

    constructor(props: LogsPageProps) {
        super(props);

        this.state = {
            width: 0,
            height: 0,
            source: props.source,
            request: undefined,
            response: undefined,
            outputs: []
        };
    }

    componentWillMount() {
        this.updateDimensions();
    }

    componentDidMount() {
        window.addEventListener("resize", this.updateDimensions.bind(this));
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.updateDimensions.bind(this));
    }

    updateDimensions() {
        let w = window,
            d = document,
            documentElement = d.documentElement,
            body = d.getElementsByTagName("mdl-layout__content")[0],
            width = w.innerWidth || documentElement.clientWidth || body.clientWidth,
            height = w.innerHeight || documentElement.clientHeight || body.clientHeight;

        this.setState({
            width: width,
            height: height,
            source: (this.state) ? this.state.source : undefined,
            request: (this.state) ? this.state.request : undefined,
            response: (this.state) ? this.state.response : undefined,
            outputs: (this.state) ? this.state.outputs : undefined
        });
    }

    componentWillReceiveProps(nextProps: LogsPageProps, nextContext: any): void {
        if (this.state.source === undefined && nextProps.source) {
            this.props.getLogs(nextProps.source.secretKey);
            this.setState({
                source: nextProps.source,
                width: this.state.width,
                height: this.state.height,
                request: this.state.request,
                response: this.state.response,
                outputs: this.state.outputs
            });
        }
    }

    onConversationClicked(conversation: Conversation, event: React.MouseEvent) {
        this.setState({
            width: this.state.width,
            height: this.state.height,
            source: this.state.source,
            request: conversation.request,
            response: conversation.response,
            outputs: conversation.outputs
        });
    }

    render() {
        return (
            <Grid
                noSpacing={true}>
                <Cell col={6} phone={4} tablet={4} style={{ paddingLeft: "10px", paddingRight: "5px" }}>
                    <div style={{ maxHeight: this.state.height, overflowY: "auto" }}>
                        <ConversationListView
                            conversations={ConversationList.fromLogs(this.props.logs)}
                            expandListItemWhenActive={browser.isMobileWidth()}
                            onClick={this.onConversationClicked.bind(this)} />
                    </div>
                </Cell>
                <Cell col={6} hidePhone={true} tablet={4} style={{ maxHeight: this.state.height, overflowY: "scroll", paddingLeft: "5px", paddingRight: "10px" }}>
                    {this.state.request ?
                        (
                            <Interaction
                                request={this.state.request}
                                response={this.state.response}
                                outputs={this.state.outputs} />
                        ) : (
                            <h6> Select a log to view </h6>
                        )
                    }
                </Cell>
            </Grid >
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LogsPage);