import * as React from "react";
import { connect } from "react-redux";

import { getLogs } from "../actions/log";
import { ComponentSelector, SelectableComponent } from "../components/ComponentSelector";
import { ConversationListView } from "../components/ConversationListView";
import { FormInput } from "../components/FormInput";
import { Cell, Grid } from "../components/Grid";
import Interaction from "../components/Interaction";
import { Select, SelectAdapter, SelectListener } from "../components/Select";
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
    retrievingLogs: boolean;
    source: Source | undefined;
    request: Log | undefined;
    response: Log | undefined;
    outputs: Output[];
    logs: Logs;
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
    filterComponents: SelectableComponent[];

    constructor(props: LogsPageProps) {
        super(props);
        this.filterComponents = [];
        this.filterComponents.push(new IDFilterComponent());
        this.state = {
            lastDimens: { width: 0, height: 0, cellDimens: { height: 0 } },
            source: props.source,
            retrievingLogs: false,
            request: undefined,
            response: undefined,
            outputs: [],
            logs: new Logs(props.logs),
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
        this.state.logs.logs = nextProps.logs;
        this.state.source = nextProps.source;
        this.setState(this.state);
    }

    onConversationClicked(conversation: Conversation, event: React.MouseEvent) {
        this.state.request = conversation.request;
        this.state.response = conversation.response;
        this.state.outputs = conversation.outputs;
        this.setState(this.state);
    }

    onRootLayout(element: Element) {
        this.root = element;
    }

    beginFilter(value: string) {
        // let startDate: Date = this.props.logs[10].timestamp;
        // let endDate: Date = this.props.logs[0].timestamp;
        // let filter = (value === undefined || value.length === 0) ? undefined : DateFilter(startDate, endDate);
        // this.state.logs.filterOut(filter)
        //     .then((logs: Log[]) => {
        //         this.state.request = undefined;
        //         this.state.response = undefined;
        //         this.state.outputs = undefined;
        //         this.setState(this.state);
        //     });
    }

    render() {
        return (
            <div
                ref={this.onRootLayout.bind(this)}>
                <ComponentSelector components={this.filterComponents} />
                <Grid
                    noSpacing={true}>
                    <Cell col={6} phone={4} tablet={4} style={{ paddingLeft: "10px", paddingRight: "5px" }}>
                        <div style={{ maxHeight: this.state.lastDimens.cellDimens.height, overflowY: "scroll" }}>
                            <ConversationListView
                                conversations={ConversationList.fromLogs(this.state.logs.logs)}
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

class Logs {
    allLogs: Log[];
    shownLogs: Log[];
    filter?: (item: Log) => boolean;

    constructor(logs: Log[]) {
        this.allLogs = this.shownLogs = (logs) ? logs : [];
    }

    get logs(): Log[] {
        return this.shownLogs;
    }

    get length(): number {
        return this.shownLogs.length;
    }

    set logs(logs: Log[]) {
        this.allLogs = (logs) ? logs : [];
        if (this.filter) {
            this.filterOut(this.filter);
        } else {
            this.shownLogs = this.allLogs;
        }
    }

    filterOut(useFilter: (item: Log) => boolean): Promise<Log[]> {
        this.filter = useFilter;
        return filter(this.allLogs, this.filter)
            .then((logs: Log[]) => {
                this.shownLogs = logs;
                return this.shownLogs;
            }).catch((err: Error) => {
                this.shownLogs = [];
                return this.shownLogs;
            });
    }
}

interface FilterType<T> {
    type: string;
    filter: (item: T) => boolean;
}

class DateFilter implements FilterType<Log> {
    startDate: Date;
    endDate: Date;

    constructor() {
        this.startDate = this.endDate = new Date();
    }

    get type(): string {
        return "Date";
    }

    get filter(): (item: Log) => boolean {
        return function (item: Log): boolean {
            let created = item.timestamp;
            return this.startDate <= created && created <= this.endDate;
        };
    }
}

class IDFilterComponent implements SelectableComponent {
    get title(): string {
        return "ID";
    }

    get component(): JSX.Element {
        return (<FormInput label={this.title} type="text" value="" onChange={(text)=> console.info("WOOO")} />);
    }
}
