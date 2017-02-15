import * as classNames from "classnames";
import * as moment from "moment";
import * as React from "react";

import Button from "../../../components/Button";
import Interaction from "../../../components/Interaction";
import TwoPane from "../../../components/TwoPane";
import VisiblityWatcher, { VISIBLITY_STATE } from "../../../components/VisibilityWatcher";
import Conversation from "../../../models/conversation";
import ConversationList from "../../../models/conversation-list";
import Log from "../../../models/log";
import LogQuery from "../../../models/log-query";
import Source from "../../../models/source";
import { LogMap } from "../../../reducers/log";
import browser from "../../../utils/browser";
import Interval from "../../../utils/Interval";
import Noop, { falseBoolNoop } from "../../../utils/Noop";
import { FilterableConversationList } from "../FilterableConversationList";
import { FilterBar } from "../FilterBar";
import { CompositeFilter, DateFilter, FilterType } from "../Filters";

const style = require("./style.scss");

const UPDATE_TIME_MS = 5000;

interface LogExplorerProps {
    logMap: LogMap;
    source: Source;
    onFilter?: (filter: FilterType) => boolean;
    lockFilterBar?: boolean;
    onItemsFiltered?: (visible: ConversationList) => void;
    onScroll?: (firstVisibleIndex: number, lastVisibleIndex: number, total: number) => void;
    onGetNewLogs?: () => void;
}

interface LogExplorerState {
    filterBarHidden: boolean;
    tailOn: boolean;
    savedTailValue?: boolean;
    dateOutOfRange?: boolean;
    selectedConvo?: Conversation;
    filter?: CompositeFilter;
}

export default class LogExplorer extends React.Component<LogExplorerProps, LogExplorerState> {

    static defaultProps: LogExplorerProps = {
        logMap: undefined,
        source: undefined,
        onFilter: falseBoolNoop,
        lockFilterBar: false,
        onItemsFiltered: Noop,
        onScroll: Noop,
        onGetNewLogs: Noop
    };

    refresher: Interval.Executor;

    constructor(props: any) {
        super(props);
        this.state = {
            filterBarHidden: false,
            tailOn: false
        };

        this.handleFilter = this.handleFilter.bind(this);
        this.handleDateFilter = this.handleDateFilter.bind(this);
        this.handleTailChecked = this.handleTailChecked.bind(this);
        this.handleFilterButtonClicked = this.handleFilterButtonClicked.bind(this);
        this.handleVisibilityChange = this.handleVisibilityChange.bind(this);

        this.refresher = Interval.newExecutor(UPDATE_TIME_MS, this.refresh.bind(this));
    }

    componentWillReceiveProps?(nextProps: LogExplorerProps, nextContext: any): void {
        if (!this.props.source || !nextProps.source || this.props.source.id !== nextProps.source.id) {
            this.state.selectedConvo = undefined;
            this.setState(this.state);
        }
    }

    componentWillMount() {
        this.enableTail();
    }

    componentWillUnmount() {
        this.disableTail();
    }

    disableTailIfNotToday(date: Date) {
        if (isToday(date)) {
            const savedTail = this.state.savedTailValue;
            if (savedTail) {
                this.enableTail();
            }
            this.state.dateOutOfRange = false;
        } else {
            this.state.savedTailValue = this.state.tailOn;
            this.state.dateOutOfRange = true;
            this.disableTail();
        }
    }

    enableTail() {
        this.refresher.start();
        this.state.tailOn = true;
        this.setState(this.state);
    }

    disableTail() {
        this.refresher.end();
        this.state.tailOn = false;
        this.setState(this.state);
    }

    onConversationClicked(conversation: Conversation) {
        this.state.selectedConvo = conversation;
        this.setState(this.state);
    }

    onScroll(firstVisibleIndex: number, lastVisibleIndex: number, total: number) {
        if (!this.state.filterBarHidden && browser.isMobileWidth() && !this.props.lockFilterBar) {
            this.state.filterBarHidden = true;
            this.setState(this.state);
        }
        this.props.onScroll(firstVisibleIndex, lastVisibleIndex, total);
    }

    handleFilter(filter: FilterType) {
        if (this.props.onFilter(filter)) {
            return;
        }
        if (!this.state.filter) {
            this.state.filter = new CompositeFilter([filter]);
        } else {
            this.state.filter = this.state.filter.copyAndAddOrReplace(filter);
        }
        this.setState(this.state);
    }

    handleDateFilter(filter: DateFilter) {
        this.disableTailIfNotToday(filter.endDate);
        this.handleFilter(filter);
    }

    handleFilterButtonClicked() {
        this.state.filterBarHidden = !this.state.filterBarHidden;
        this.setState(this.state);
    }

    handleVisibilityChange(visibilityState: VISIBLITY_STATE) {
        if (visibilityState === "hidden") {
            this.state.savedTailValue = this.state.tailOn;
            this.disableTail();
        } else if (visibilityState === "visible") {
            if (this.state.savedTailValue) {
                this.enableTail();
            }
        }
    }

    handleTailChecked(enabled: boolean) {
        if (enabled) {
            this.enableTail();
        } else {
            this.disableTail();
        }
    }

    filterBarClasses() {
        return classNames(style.filterBar, {
            [style.filterBarHidden]: this.state.filterBarHidden
        });
    }

    refresh() {
        console.info("REFRESH");
        this.props.onGetNewLogs();
    }

    render(): JSX.Element {

        let query: LogQuery;
        let logs: Log[];

        if (this.props.source && this.props.logMap) {
            let logMap = this.props.logMap[this.props.source.id];
            if (logMap) {
                query = logMap.query;
                logs = logMap.logs;
            }
        }

        let leftSide = (
            <FilterableConversationList
                conversations={ConversationList.fromLogs(logs)}
                filter={this.state.filter}
                onScroll={this.onScroll.bind(this)}
                onShowConversation={this.onConversationClicked.bind(this)}
                onItemsFiltered={this.props.onItemsFiltered} />
        );

        let rightSide = this.state.selectedConvo ?
            (
                <Interaction
                    request={this.state.selectedConvo.request}
                    response={this.state.selectedConvo.response}
                    outputs={this.state.selectedConvo.outputs}
                    stackTraces={this.state.selectedConvo.stackTraces} />
            ) : (
                <h6> Select a log to view </h6>
            );

        return (
            <VisiblityWatcher onChange={this.handleVisibilityChange} >
                <span>
                    <FilterBar className={this.filterBarClasses()}
                        liveUpdateEnabled={this.state.tailOn}
                        onFilterDate={this.handleDateFilter}
                        onFilterIntent={this.handleFilter}
                        onFilterLogLevel={this.handleFilter}
                        onFilterException={this.handleFilter}
                        onFilterRequest={this.handleFilter}
                        onFilterOrigin={this.handleFilter}
                        onLiveUpdate={this.handleTailChecked}
                        disableLiveUpdateCheckbox={this.state.dateOutOfRange}
                        query={query} />
                    <TwoPane
                        leftStyle={{ paddingLeft: "10px", paddingRight: "5px", zIndex: 1 }}
                        rightStyle={{ paddingLeft: "5px", paddingRight: "10px" }}
                        spacing={true}>
                        {leftSide}
                        {rightSide}
                    </TwoPane>
                    {this.state.filterBarHidden ? (
                        <Button
                            className={style.button}
                            fab
                            colored
                            onClick={this.handleFilterButtonClicked}>
                            <i className="material-icons">filter_list</i>
                        </Button>
                    ) : undefined}
                </span>
            </VisiblityWatcher>
        );
    }
}

function isToday(date: Date): boolean {
    return moment(date).isSame(moment(), "days");
}