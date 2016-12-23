import * as React from "react";
import { connect } from "react-redux";

import { Cell, Grid } from "../../components/Grid";
import Interaction from "../../components/Interaction";
import Conversation from "../../models/conversation";
import ConversationList from "../../models/conversation-list";
import Log from "../../models/log";
import LogQuery from "../../models/log-query";
import Output from "../../models/output";
import Source from "../../models/source";
import StackTrace from "../../models/stack-trace";
import { State } from "../../reducers";
import { LogMap } from "../../reducers/log";
import browser from "../../utils/browser";
import { FilterableConversationList } from "./FilterableConversationList";
import { FilterBar } from "./FilterBar";
import { FilterType } from "./Filters";

interface CellDimensions {
    height: number;
}

interface Dimensions {
    width: number;
    height: number;
    cellDimens: CellDimensions;
}

export interface LogsPageProps {
    logMap: LogMap;
    source: Source;
    params?: any;
}

interface LogsPageState {
    lastDimens: Dimensions;
    request: Log | undefined;
    response: Log | undefined;
    outputs: Output[];
    stackTraces: StackTrace[];
    filter?: FilterType;
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

export class LogsPage extends React.Component<LogsPageProps, LogsPageState> {

    root: Element;
    resizeEvent: browser.WrappedEvent;

    constructor(props: LogsPageProps) {
        super(props);
        this.state = {
            lastDimens: { width: 0, height: 0, cellDimens: { height: 0 } },
            request: undefined,
            response: undefined,
            outputs: [],
            stackTraces: []
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

    onConversationClicked(conversation: Conversation) {
        this.state.request = conversation.request;
        this.state.response = conversation.response;
        this.state.outputs = conversation.outputs;
        this.state.stackTraces = conversation.stackTraces;
        this.setState(this.state);
    }

    onRootLayout(element: Element) {
        this.root = element;
    }

    handleFilter(filter: FilterType) {
        this.state.filter = filter;
        this.setState(this.state);
    }

    render() {

        let query: LogQuery;
        let logs: Log[];

        if (this.props.source) {
            query = this.props.logMap[this.props.source.id].query;
            logs = this.props.logMap[this.props.source.id].logs;
        }

        return (
            <span>
                <FilterBar onFilter={this.handleFilter.bind(this)} query={query}/>
                <div ref={this.onRootLayout.bind(this)}>
                    <Grid
                        noSpacing={true}>
                        <Cell col={6} phone={4} tablet={4} style={{ paddingLeft: "10px", paddingRight: "5px" }}>
                            <FilterableConversationList
                                height={this.state.lastDimens.cellDimens.height}
                                conversations={ConversationList.fromLogs(logs)}
                                filter={this.state.filter}
                                onShowConversation={this.onConversationClicked.bind(this)} />
                        </Cell>
                        <Cell col={6} hidePhone={true} tablet={4} style={{ maxHeight: this.state.lastDimens.cellDimens.height, overflowY: "scroll", paddingLeft: "5px", paddingRight: "10px" }}>
                            {this.state.request ?
                                (
                                    <Interaction
                                        request={this.state.request}
                                        response={this.state.response}
                                        outputs={this.state.outputs}
                                        stackTraces={this.state.stackTraces} />
                                ) : (
                                    <h6> Select a log to view </h6>
                                )
                            }
                        </Cell>
                    </Grid >
                </div>
            </span>
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LogsPage);
