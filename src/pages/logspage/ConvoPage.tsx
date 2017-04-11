import * as React from "react";
import { connect } from "react-redux";

import VisibilityWatcher, { VISIBLITY_STATE } from "../../components/VisibilityWatcher";
import Conversation from "../../models/conversation";
import Source from "../../models/source";
import { State } from "../../reducers";
import DateUtils from "../../utils/date";
import ConvoExplorerPage from "./ConvoExplorerPage";
import FilterBar, { DateRange } from "./FilterBar";
import { DateFilter, UserIDFilter } from "./filters/ConvoFilters";
import { CompositeFilter, Filter } from "./filters/Filters";

const TOOLTIP_ACTIVE = "Unset Filter";
const TOOLTIP_DEACTIVE = "Filter User";
const ACTIVE_ICON_STYLE: React.CSSProperties = {
    background: "#AAAAAA"
};

interface ConvoPageStateProps {
    readonly source: Source;
}

interface ConvoPageDispatchProps {
}

interface ConvoPageProps extends ConvoPageStateProps, ConvoPageDispatchProps {
}

interface ConvoPageState {
    readonly dateRange: DateRange;
    readonly filter: CompositeFilter<Conversation>;
    readonly refreshOn: boolean;
    readonly refreshDisabled: boolean;
    readonly savedRefreshState: boolean;
    readonly iconStyle: React.CSSProperties;
    readonly iconTooltip: string;
}

function mapStateToProps(state: State.All): ConvoPageStateProps {
    return {
        source: state.source.currentSource
    };
}

function mapDispatchToProps(dispatch: Redux.Dispatch<any>): ConvoPageDispatchProps {
    return {};
}

export class ConvoPage extends React.Component<ConvoPageProps, ConvoPageState> {

    constructor(props: ConvoPageProps) {
        super(props);

        this.handleFilter = this.handleFilter.bind(this);
        this.handleLiveUpdate = this.handleLiveUpdate.bind(this);
        this.handleDateFilter = this.handleDateFilter.bind(this);
        this.handleVisiblityChange = this.handleVisiblityChange.bind(this);
        this.handleIconClick = this.handleIconClick.bind(this);

        const startDate: Date = DateUtils.daysAgo(7);
        startDate.setHours(0, 0, 0, 0);

        const endDate: Date = DateUtils.daysAgo(0);
        endDate.setHours(23, 59, 59, 999);

        const initialFilter = new DateFilter(startDate, endDate);

        this.state = {
            dateRange: { startTime: initialFilter.startDate, endTime: initialFilter.endDate },
            filter: new CompositeFilter([initialFilter]),
            refreshDisabled: false,
            refreshOn: true,
            savedRefreshState: true,
            iconStyle: undefined,
            iconTooltip: TOOLTIP_DEACTIVE
        };
    }

    handleFilter(filter: Filter<Conversation>) {
        this.setState({ filter: this.state.filter.copyAndAddOrReplace(filter) } as ConvoPageState);
    }

    handleDateFilter(filter: DateFilter) {
        const endIsToday = isToday(filter.endDate);
        this.handleFilter(filter);
        this.setState({ dateRange: { startTime: filter.startDate, endTime: filter.endDate }, refreshOn: endIsToday, refreshDisabled: !endIsToday } as ConvoPageState);
    }

    handleIconClick(convo: Conversation) {
        const alreadyFilteringUser = this.state.iconStyle !== undefined;
        if (alreadyFilteringUser) {
            this.setState({ iconStyle: undefined, iconTooltip: TOOLTIP_DEACTIVE, filter: this.state.filter.copyAndRemove(UserIDFilter.type) } as ConvoPageState);
        } else {
            this.setState({ iconStyle: ACTIVE_ICON_STYLE, iconTooltip: TOOLTIP_ACTIVE } as ConvoPageState);
            this.handleFilter(new UserIDFilter(convo.userId, true));
        }
    }

    handleLiveUpdate(enabled: boolean) {
        this.setState({ refreshOn: enabled, savedRefreshState: enabled } as ConvoPageState);
    }

    handleVisiblityChange(state: VISIBLITY_STATE) {
        this.setState({ refreshOn: state === "visible" && this.state.savedRefreshState } as ConvoPageState);
    }

    render() {
        return (
            <VisibilityWatcher
                onChange={this.handleVisiblityChange} >
                <FilterBar
                    onFilterLogLevel={this.handleFilter}
                    onFilterRequest={this.handleFilter}
                    onFilterIntent={this.handleFilter}
                    onFilterException={this.handleFilter}
                    onFilterOrigin={this.handleFilter}
                    onFilterDate={this.handleDateFilter}
                    onLiveUpdate={this.handleLiveUpdate}
                    dateRange={this.state.dateRange}
                    liveUpdateEnabled={this.state.refreshOn && !this.state.refreshDisabled}
                    disableLiveUpdateCheckbox={this.state.refreshDisabled} />
                <ConvoExplorerPage
                    onIconClick={this.handleIconClick}
                    iconStyle={this.state.iconStyle}
                    iconTooltip={this.state.iconTooltip}
                    refreshOn={this.state.refreshOn}
                    filter={this.state.filter} />
            </VisibilityWatcher>
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ConvoPage);

function isToday(date: Date) {
    return new Date().toDateString() === date.toDateString();
}