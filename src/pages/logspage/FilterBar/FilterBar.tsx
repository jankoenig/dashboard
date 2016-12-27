import * as classNames from "classnames";
import * as moment from "moment";
import * as React from "react";
import DatePicker from "react-toolbox/lib/date_picker";

import Button from "../../../components/Button";
import { Cell, Grid } from "../../../components/Grid";
import { Select, SelectAdapter } from "../../../components/Select";
import LogQuery from "../../../models/log-query";
import { CompositeFilter, DateFilter, FilterType, LogLevelFilter } from "../Filters";

const FilterBarStyle = require("./style");
const DatePickerTheme = require("./datepicker-input-theme");

const SelectInputStyle = {
    "color": "rgb(255, 255, 255)",
    "borderBottom": "1px solid rgb(255, 255, 255)"
};

const SelectLabelStyle = {
    "color": "rgba(255, 255, 255, 0.3)"
};

const SelectIconStyle = {
    "color": "rgb(255, 255, 255)"
};

export interface FilterProps {
    query: LogQuery;
    onFilter: (filter: FilterType) => void;
}

interface FilterState {
    startDate?: Date;
    endDate?: Date;
    selectedType?: ConvoType;
    filterMap: any;
    filterbarHidden: boolean;
}

interface ConvoType {
    type: string;
    title: string;
}

class ConvoTypeAdapter implements SelectAdapter<ConvoType> {
    filterTypes: ConvoType[];

    constructor(types: ConvoType[]) {
        this.filterTypes = types;
    }

    getCount(): number {
        return this.filterTypes.length;
    }

    getItem(index: number): ConvoType {
        return this.filterTypes[index];
    };

    getTitle(index: number): string {
        let type = this.filterTypes[index];
        return (type !== undefined) ? type.title : undefined;
    };
}

class FilterBar extends React.Component<FilterProps, FilterState> {
    private filterAdapter: ConvoTypeAdapter;

    constructor(props: FilterProps) {
        super(props);
        console.log("filterBar constructor");
        let types: ConvoType[] = [];
        types.push({ type: "", title: "All Logs" });
        types.push({ type: "DEBUG", title: "Debug" });
        types.push({ type: "INFO", title: "Info" });
        types.push({ type: "WARN", title: "Warning" });
        types.push({ type: "ERROR", title: "Error" });
        this.filterAdapter = new ConvoTypeAdapter(types);

        this.state = {
            filterMap: {},
            filterbarHidden: false
        };
    }

    gridClasses() {
        return classNames(FilterBarStyle.filterBarGrid, {
            [FilterBarStyle.filterBarGridHidden]: this.state.filterbarHidden
        });
    }

    componentWillReceiveProps(nextProps: FilterProps) {

        // The first time we get the query,
        // we set it as the initial start and end dates.
        if (!this.state.endDate && nextProps.query) {
            this.state.startDate = nextProps.query.startTime;
            this.state.startDate.setHours(0, 0, 0, 0);

            this.state.endDate = nextProps.query.endTime;
            this.state.endDate.setHours(23, 59, 59, 999);

            this.setState(this.state);
        }
    }

    handleDateChange(item: "startDate" | "endDate", value: Date) {

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

    handleTypeSelectChange(value: ConvoType) {
        let type = (value) ? value.type : undefined;

        this.state.selectedType = value;
        this.setState(this.state);
        this.newFilter(new LogLevelFilter(type));
    }

    newFilter(filter: FilterType) {
        this.state.filterMap[filter.type] = filter;
        let filterMap = this.state.filterMap;
        let filters = Object.keys(this.state.filterMap).map(function (key) { return filterMap[key]; });
        this.props.onFilter(new CompositeFilter(filters));
    }

    handleFilterClicked(event: React.MouseEvent) {
        this.state.filterbarHidden = !this.state.filterbarHidden;
        this.setState(this.state);
    }

    render(): JSX.Element {
        console.log("filterBar render");
        console.log(this.props.query);
        let queryStartDate = this.props.query ? this.props.query.startTime : new Date();
        let queryEndDate = this.props.query ? this.props.query.endTime : new Date();
        let typeHandleChange = this.handleTypeSelectChange.bind(this);
        let startHandleChange = this.handleDateChange.bind(this, "startDate");
        let endHandleChange = this.handleDateChange.bind(this, "endDate");

        return (
            <span /* style={{position: "relative"}} */>
                <Grid className={this.gridClasses()} >
                    <Cell col={2} tablet={2} phone={4}>
                        <Select
                            inputStyle={SelectInputStyle}
                            labelStyle={SelectLabelStyle}
                            iconStyle={SelectIconStyle}
                            adapter={this.filterAdapter}
                            hint={"Log Level"}
                            onSelected={typeHandleChange} />
                    </Cell>
                    <Cell col={2} offset={5} tablet={2} offsetTablet={1} phone={2}>
                        <DatePicker
                            theme={DatePickerTheme}
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
                            theme={DatePickerTheme}
                            label="End Date"
                            // You can't select the same date as the start date
                            minDate={moment(this.state.startDate).add(1, "days").toDate()}
                            maxDate={queryEndDate}
                            value={this.state.endDate}
                            onChange={endHandleChange}
                            readonly={this.props.query ? false : true} />
                    </Cell>
                </Grid>
                <Button className={FilterBarStyle.filterBarButton} fab colored onClick={this.handleFilterClicked.bind(this)}><i className="material-icons">filter_list</i></Button>
            </span>
        );
    }
}

export default FilterBar;