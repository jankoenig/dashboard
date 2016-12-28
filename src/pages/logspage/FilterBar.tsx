import * as React from "react";
import DatePicker from "react-toolbox/lib/date_picker";
import Dropdown from "react-toolbox/lib/dropdown";

import { Cell, Grid } from "../../components/Grid";
import { CompositeFilter, DateFilter, FilterType, LogLevelFilter } from "./Filters";

const DatePickerTheme = require("./themes/datepicker-input");
const DropdownLightTheme = require("../../themes/dropdown-light");

export interface FilterProps {
    onFilter: (filter: FilterType) => void;
}

interface FilterState {
    startDate?: Date;
    endDate?: Date;
    logTypes?: LogType[];
    selectedType?: string;
    filterMap: any;
}

interface LogType {
    value: string;
    label: string;
}

export class FilterBar extends React.Component<FilterProps, FilterState> {

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
            logTypes: types
        };
    }

    handleDateChange(item: string, value: Date) {
        // Right now these don't allow time so going to assume the beginning and the end of whatever day it's at.
        if (item === "startDate") {
            this.state.startDate = value;
            this.state.startDate.setHours(0, 0, 0, 0);
        } else if (item === "endDate") {
            this.state.endDate = value;
            this.state.endDate.setHours(23, 59, 59, 999);
        }
        this.setState(this.state);
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
        let today = new Date();
        let startHandleChange = this.handleDateChange.bind(this, "startDate");
        let endHandleChange = this.handleDateChange.bind(this, "endDate");

        return (
            <Grid style={{ backgroundColor: "#243036" }} >
                <Cell col={2} tablet={2} phone={4}>
                    <Dropdown
                        theme={DropdownLightTheme}
                        label="Log Level"
                        auto={false}
                        onChange={this.handleLogTypeChange.bind(this)}
                        source={this.state.logTypes}
                        value={this.state.selectedType}
                        />
                </Cell>
                <Cell col={2} offset={5} tablet={2} offsetTablet={1} phone={2}>
                    <DatePicker
                        theme={DatePickerTheme}
                        label="Start Date"
                        maxDate={today}
                        value={this.state.startDate}
                        onChange={startHandleChange} />
                </Cell>
                <p style={{ color: "rgb(255, 255, 255)", fontSize: "26px", margin: "auto -5px", marginTop: "28px", display: "inline-block" }}>-</p>
                <Cell col={2} tablet={2} phone={2}>
                    <DatePicker
                        theme={DatePickerTheme}
                        label="End Date"
                        maxDate={today}
                        value={this.state.endDate}
                        onChange={endHandleChange} />
                </Cell>
            </Grid>
        );
    }
}