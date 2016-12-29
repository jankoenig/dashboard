import * as React from "react";

import { Cell, Grid } from "../components/Grid";
import Interaction from "../components/Interaction";
import Conversation from "../models/conversation";
import ConversationList from "../models/conversation-list";
import Log from "../models/log";
import LogQuery from "../models/log-query";
import Output from "../models/output";
import StackTrace from "../models/stack-trace";
import { FilterableConversationList } from "../pages/logsPage/FilterableConversationList";
import { FilterBar } from "../pages/logsPage/FilterBar";
import { FilterType } from "../pages/logsPage/Filters";
import browser from "../utils/browser";

import Source from "../models/source";
import { LogMap } from "../reducers/log";

interface CellDimensions {
    height: number;
}

interface Dimensions {
    width: number;
    height: number;
    cellDimens: CellDimensions;
}

interface LogExplorerProps {
    logMap: LogMap;
    source: Source;
}

interface LogExplorerState {
    lastDimens: Dimensions;
    request: Log | undefined;
    response: Log | undefined;
    outputs: Output[];
    stackTraces: StackTrace[];
    filter?: FilterType;
}

export default class LogExplorer extends React.Component<LogExplorerProps, LogExplorerState> {

    root: Element;
    resizeEvent: browser.WrappedEvent;

    constructor(props: any) {
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
    updateDimensions() {
        console.log("updateDimensions");
        let dimens: Dimensions = this.getDimensions();
        if (this.shouldUpdate(dimens)) {
            this.state.lastDimens = dimens;
            // Setting the state causes a re-render, which updates
            this.setState(this.state);
        }
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

    render(): JSX.Element {

        let query: LogQuery;
        let logs: Log[];

        if (this.props.source) {
            query = this.props.logMap[this.props.source.id].query;
            logs = this.props.logMap[this.props.source.id].logs;
        }

        return (
            <span>
                { query ? (
                    <FilterBar onFilter={this.handleFilter.bind(this)} query={query} />
                ) : undefined }
                    <div ref={this.onRootLayout.bind(this)}>
                    <Grid noSpacing={true}>
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