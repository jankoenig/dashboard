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

interface CellDimensions {
    height: number;
}

interface Dimensions {
    width: number,
    height: number,
    cellDimens: CellDimensions
}

export interface LogsPageProps {
    logs: Log[];
    source: Source;
    getLogs: (source: string) => (dispatch: Redux.Dispatch<any>) => void;
    params?: any;
}

interface LogsPageState {
    lastDimens: Dimensions;
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

    resizeEvent: browser.WrappedEvent;

    constructor(props: LogsPageProps) {
        super(props);
        this.state = {
            lastDimens: { width: 0, height: 0, cellDimens: { height: 0 } },
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
        this.resizeEvent = browser.onResize(this.updateDimensions.bind(this));
        this.resizeEvent.register();
    }

    componentWillUnmount() {
        this.resizeEvent.unregister();
    }

    updateDimensions() {
        // Algorithm taken from https://andylangton.co.uk/blog/development/get-viewportwindow-size-width-and-height-javascript
        // Modified to get around unit tests which don't have half this.
        let width: number, height: number, heightOffset: number;
        if (window) {
            let w = window,
                d = document,
                dElement = d.documentElement,
                body = d.getElementsByClassName(Grid.GRID_CLASS)[0];

            width = w.innerWidth || dElement.clientWidth || (body ? body.clientWidth : 0);
            height = w.innerHeight || dElement.clientHeight || (body ? body.clientHeight : 0);

            if (body) {
                let rect = dElement.getBoundingClientRect();
                let rect2 = body.getBoundingClientRect();
                console.info("LIST: Offset = " + body.clientLeft + " " + body.clientTop + " " + body.clientWidth + " " + body.clientHeight);
                console.info("LIST: rect2 " + rect2.left + " " + rect2.top + " " + rect2.right + " " + rect2.bottom);
                console.info("LIST: rect2 Dimen " + rect2.width + " " + rect2.height);
                heightOffset = rect2.top;
            } else {
                heightOffset = 0;
            }
        } else {
            // Unit tests
            width = 200;
            height = 200;
            heightOffset = 0;
        }

        console.info("Final " + width + " " + height + " " + heightOffset);

        this.setState({
            lastDimens: {
                width: width,
                height: height,
                cellDimens: {
                    height: height - heightOffset,
                }
            },
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
                lastDimens: this.state.lastDimens,
                request: this.state.request,
                response: this.state.response,
                outputs: this.state.outputs
            });
        }
    }

    onConversationClicked(conversation: Conversation, event: React.MouseEvent) {
        this.setState({
            request: conversation.request,
            response: conversation.response,
            outputs: conversation.outputs,
            lastDimens: this.state.lastDimens,
            source: this.state.source,
        });
    }

    render() {
        console.info("RENDER " + this.state.lastDimens.width + " " + this.state.lastDimens.height + " " + this.state.lastDimens.cellDimens.height);
        return (
            <Grid
                noSpacing={true}>
                <Cell col={6} phone={4} tablet={4} style={{ paddingLeft: "10px", paddingRight: "5px" }}>
                    <div style={{ maxHeight: this.state.lastDimens.cellDimens.height, overflowY: "auto" }}>
                        <ConversationListView
                            conversations={ConversationList.fromLogs(this.props.logs)}
                            expandListItemWhenActive={browser.isMobileWidth()}
                            onClick={this.onConversationClicked.bind(this)} />
                    </div>
                </Cell>
                <Cell col={6} hidePhone={true} tablet={4} style={{ maxHeight: this.state.lastDimens.cellDimens.height, overflowY: "scroll", paddingLeft: "5px", paddingRight: "10px" }}>
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