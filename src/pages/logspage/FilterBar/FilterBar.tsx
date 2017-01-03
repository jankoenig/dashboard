import * as classNames from "classnames";
import * as moment from "moment";
import * as React from "react";
import DatePicker from "react-toolbox/lib/date_picker";
import Dropdown from "react-toolbox/lib/dropdown";

import { Cell, Grid } from "../../../components/Grid";
import LogQuery from "../../../models/log-query";
import { CompositeFilter, DateFilter, FilterType, LogLevelFilter } from "../Filters";

const FilterBarStyle = require("./style.scss");
const DatePickerFilterbarTheme = require("../../../themes/datepicker-filterbar.scss");
const DropdownFilterbarTheme = require("../../../themes/dropdown-filterbar.scss");

export interface FilterProps {
    query: LogQuery;
    onFilter: (filter: FilterType) => void;
    className?: string;
}

interface LogType {
    value: string;
    label: string;
}

interface FilterState {
    startDate?: Date;
    endDate?: Date;
    logTypes?: LogType[];
    selectedType?: string;
    filterMap: any;
    filterbarHidden: boolean;
}

class FilterBar extends React.Component<FilterProps, FilterState> {

    constructor(props: FilterProps) {
        super(props);

        let types: LogType[] = [];
        types.push({ value: "", label: "All Logs" });
        types.push({ value: "DEBUG", label: "Debug" });
        types.push({ value: "INFO", label: "Info" });
        types.push({ value: "WARN", label: "Warning" });
        types.push({ value: "ERROR", label: "Error" });

        this.state = {
            filterMap: {},
            selectedType: types[0].value,
            logTypes: types,
            filterbarHidden: false,
            startDate: props.query ? props.query.startTime : undefined,
            endDate: props.query ? props.query.endTime : undefined
        };
    }

    gridClasses() {
        return classNames(FilterBarStyle.filterBarGrid, this.props.className);
    }

    componentWillReceiveProps(nextProps: FilterProps) {
        // The first time we get the query,
        // we set it as the initial start and end dates.
        if (!this.state.endDate && nextProps.query) {
            this.setDateRange(nextProps.query.startTime, nextProps.query.endTime);
        }
    }

    setDateRange(startDate: Date, endDate: Date) {
        if (startDate && endDate) {
            // Right now these don't allow time so going to assume the beginning and the end of whatever day it's at.
            this.state.startDate = startDate;
            this.state.startDate.setHours(0, 0, 0, 0);

            this.state.endDate = endDate;
            this.state.endDate.setHours(23, 59, 59, 999);

            this.setState(this.state);
        }
    }

    handleDateChange(item: "startDate" | "endDate", value: Date) {

        if (item === "startDate") {
            this.setDateRange(value, this.state.endDate);
        } else if (item === "endDate") {
            this.setDateRange(this.state.startDate, value);
        }

        this.newFilter(new DateFilter(this.state.startDate, this.state.endDate));
    }

    handleLogTypeChange(value: string) {
        this.state.selectedType = value;
        this.setState(this.state);
        this.newFilter(new LogLevelFilter(value));
    }

    newFilter(filter: FilterType) {
        this.state.filterMap[filter.type] = filter;
        let filterMap = this.state.filterMap;
        let filters = Object.keys(this.state.filterMap).map(function (key) { return filterMap[key]; });
        this.props.onFilter(new CompositeFilter(filters));
    }

    render(): JSX.Element {
        let queryStartDate = this.props.query ? moment(this.props.query.startTime).subtract(1, "days").toDate() : new Date();
        let queryEndDate = this.props.query ? this.props.query.endTime : new Date();
        let startHandleChange = this.handleDateChange.bind(this, "startDate");
        let endHandleChange = this.handleDateChange.bind(this, "endDate");

        return (
            <Grid className={this.gridClasses()} >
                <Cell col={2} tablet={2} phone={4}>
                    <Dropdown
                        theme={DropdownFilterbarTheme}
                        label="Log Level"
                        auto={false}
                        onChange={this.handleLogTypeChange.bind(this)}
                        source={this.state.logTypes}
                        value={this.state.selectedType}
                        />
                </Cell>
                <Cell col={2} offset={5} tablet={2} offsetTablet={1} phone={2}>
                    <DatePicker
                        theme={DatePickerFilterbarTheme}
                        label="Start Date"
                        minDate={queryStartDate}
                        // You can't select the same date as the end date
                        maxDate={moment(this.state.endDate).subtract(1, "days").toDate()}
                        value={this.state.startDate}
                        onChange={startHandleChange}
                        readonly={this.props.query ? false : true} />
                </Cell>
                <p style={{ color: "rgb(255, 255, 255)", fontSize: "26px", margin: "auto -5px", marginTop: "28px", display: "inline-block" }}>-</p>
                <Cell col={2} tablet={2} phone={2}>
                    <DatePicker
                        theme={DatePickerFilterbarTheme}
                        label="End Date"
                        // You can't select the same date as the start date
                        minDate={moment(this.state.startDate).add(1, "days").toDate()}
                        maxDate={queryEndDate}
                        value={this.state.endDate}
                        onChange={endHandleChange}
                        readonly={this.props.query ? false : true} />
                </Cell>
            </Grid>
        );
    }
}

export default FilterBar;