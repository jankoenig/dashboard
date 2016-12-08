import * as React from "react";
import { connect } from "react-redux";

import { getLogs } from "../../actions/log";
import { Cell, Grid } from "../../components/Grid";
import Interaction from "../../components/Interaction";
import Conversation from "../../models/conversation";
import ConversationList from "../../models/conversation-list";
import Log from "../../models/log";
import Output from "../../models/output";
import Source from "../../models/source";
import { State } from "../../reducers";
import browser from "../../utils/browser";
import { FilterableConversationList } from "./FilterableConversationList";

interface CellDimensions {
    height: number;
}

interface Dimensions {
    width: number;
    height: number;
    cellDimens: CellDimensions;
}

export interface LogsPageProps {
    logs: Log[];
    source: Source;
    getLogs: (source: string) => (dispatch: Redux.Dispatch<any>) => void;
    params?: any;
}

interface LogsPageState {
    lastDimens: Dimensions;
    retrievingLogs: boolean;
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

    root: Element;
    resizeEvent: browser.WrappedEvent;

    constructor(props: LogsPageProps) {
        super(props);
        this.state = {
            lastDimens: { width: 0, height: 0, cellDimens: { height: 0 } },
            source: props.source,
            retrievingLogs: false,
            request: undefined,
            response: undefined,
            outputs: []
        };
    }

    componentDidMount() {
        this.resizeEvent = browser.onResize(this.updateDimensions.bind(this));
        this.resizeEvent.register();
        this.updateDimensions();
    }

    componentWillUnmount() {
        this.resizeEvent.unregister();
    }

    updateDimensions() {
        let dimens: Dimensions = this.getDimensions();
        if (this.shouldUpdate(dimens)) {
            this.state.lastDimens = dimens;
            this.setState(this.state);
        }
    }

    getDimensions(): Dimensions {
        // Algorithm taken from https://andylangton.co.uk/blog/development/get-viewportwindow-size-width-and-height-javascript
        // Modified to get around unit tests which don't have half this.
        let width: number, height: number, heightOffset: number;
        if (window) {
            let windowDimens = browser.size();
            let rect = this.root.getBoundingClientRect();

            width = windowDimens.width;
            height = windowDimens.height;
            heightOffset = rect.top;
        } else {
            // Unit tests
            width = 200;
            height = 200;
            heightOffset = 0;
        }

        return {
            width: width,
            height: height,
            cellDimens: {
                height: height - heightOffset,
            }
        };
    }

    shouldUpdate(dimens: Dimensions): boolean {
        let lastDimens = this.state.lastDimens;
        return lastDimens.height !== dimens.height ||
            dimens.width < browser.mobileWidthThreshold && lastDimens.width >= browser.mobileWidthThreshold ||
            dimens.width >= browser.mobileWidthThreshold && lastDimens.width < browser.mobileWidthThreshold;
    }

    componentWillReceiveProps(nextProps: LogsPageProps, nextContext: any): void {
        if (this.state.retrievingLogs) {
            this.state.retrievingLogs = false;
        } else {
            this.props.getLogs(nextProps.source.secretKey);
            this.state.retrievingLogs = true;
        }
        this.state.source = nextProps.source;
        this.setState(this.state);
    }

    onConversationClicked(conversation: Conversation) {
        this.state.request = conversation.request;
        this.state.response = conversation.response;
        this.state.outputs = conversation.outputs;
        this.setState(this.state);
    }

    onRootLayout(element: Element) {
        this.root = element;
    }

    render() {
        return (
            <div
                ref={this.onRootLayout.bind(this)}>
                <Grid
                    noSpacing={true}>
                    <Cell col={6} phone={4} tablet={4} style={{ paddingLeft: "10px", paddingRight: "5px" }}>
                        <FilterableConversationList
                            height={this.state.lastDimens.cellDimens.height}
                            conversations={ConversationList.fromLogs(this.props.logs)}
                            onShowConversation={this.onConversationClicked.bind(this)} />
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
            </div>
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LogsPage);
