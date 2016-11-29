import * as React from "react";
import { connect } from "react-redux";

import { getLogs } from "../actions/log";
import { ConversationListView } from "../components/ConversationListView";
import { Cell, Grid } from "../components/Grid";
import Interaction from "../components/Interaction";
import { Menu, MenuItem } from "../components/Menu";
import Select from "../components/Select";
import Conversation from "../models/conversation";
import ConversationList from "../models/conversation-list";
import Log from "../models/log";
import Output from "../models/output";
import Source from "../models/source";
import { State } from "../reducers";
import browser from "../utils/browser";
import { filter } from "../utils/promise-utils";

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
            this.setState({
                lastDimens: dimens,
                source: (this.state) ? this.state.source : undefined,
                request: (this.state) ? this.state.request : undefined,
                response: (this.state) ? this.state.response : undefined,
                outputs: (this.state) ? this.state.outputs : undefined
            });
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

    onRootLayout(element: Element) {
        this.root = element;
    }

    beginFilter(value: string) {
        let startDate: Date = this.props.logs[25].timestamp;
        let endDate: Date = this.props.logs[0].timestamp;
        console.info("Start date = " + startDate);
        console.info("End date " + endDate);
        filter(this.props.logs, DateFilter(startDate, endDate))
            .then(function(logs: Log[]) {
                console.info("Found " + logs.length + " logs");
            }).catch(function(err: Error) {
                console.info("No logs found. " + err.message);
            });
    }

    render() {
        return (
            <div
                ref={ this.onRootLayout.bind(this) }>
                <FilterComponent onChange={this.beginFilter.bind(this)} />
                <Grid
                    noSpacing={true}>
                    <Cell col={6} phone={4} tablet={4} style={{ paddingLeft: "10px", paddingRight: "5px" }}>
                        <div style={{ maxHeight: this.state.lastDimens.cellDimens.height, overflowY: "scroll" }}>
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
            </div>
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LogsPage);

interface  FilterProps {
    onChange: (text: string) => void;
}

interface FilterState {

}

class FilterComponent extends React.Component<FilterProps, FilterState> {
    constructor(props: FilterProps) {
        super(props);
        this.state = {
        };
    }

    handleChange(event: any) {
        console.info("This was found " + event.value);
        this.props.onChange(event.value);
    }

    render() {
        return (
            <form action="#">
                <input type="text" name="sort" onChange={this.handleChange.bind(this)}/>
            </form>
        );
    }
}

function DateFilter(startDate: Date, endDate: Date): (item: Log) => boolean {
    return function(item: Log): boolean {
        let created = item.timestamp;
        console.info(startDate + " " + created + " " + endDate);
        console.info("Filtering " + created + " " + (startDate <= created) + " " + (created <= endDate));
        return startDate <= created && created <= endDate;
    };
}
