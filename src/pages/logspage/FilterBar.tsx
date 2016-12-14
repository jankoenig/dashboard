import * as React from "react";
import DatePicker from "react-toolbox/lib/date_picker";

import { CompositeFilter, DateFilter, FilterType, TypeFilter } from "./Filters";

import { Select, SelectAdapter } from "../../components/Select";

const DatePickerTheme = require("./themes/datepicker-input");

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
    onFilter: (filter: FilterType) => void;
}

interface FilterState {
    startDate?: Date;
    endDate?: Date;
    selectedType?: ConvoType;
    filterMap: any;
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

export class FilterBar extends React.Component<FilterProps, FilterState> {
    filterAdapter: ConvoTypeAdapter;

    constructor(props: FilterProps) {
        super(props);
        let types: ConvoType[] = [];
        types.push(undefined);
        types.push({ type: "INFO", title: "Info" });
        types.push({ type: "DEBUG", title: "Debug" });
        types.push({ type: "WARN", title: "Warning" });
        types.push({ type: "ERROR", title: "Error" });
        this.filterAdapter = new ConvoTypeAdapter(types);

        this.state = {
            filterMap: {}
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

    handleTypeSelectChange(value: ConvoType) {
        let type = (value) ? value.type : undefined;
        console.info("TYPE " + type);

        this.state.selectedType = value;
        this.setState(this.state);
        this.newFilter(new TypeFilter(type));
    }

    newFilter(filter: FilterType) {
        this.state.filterMap[filter.type] = filter;
        let filterMap = this.state.filterMap;
        let filters = Object.keys(this.state.filterMap).map( function(key) { return filterMap[key]; } );
        this.props.onFilter(new CompositeFilter(filters));
    }

    render(): JSX.Element {
        let today = new Date();
        let typeHandleChange = this.handleTypeSelectChange.bind(this);
        let startHandleChange = this.handleDateChange.bind(this, "startDate");
        let endHandleChange = this.handleDateChange.bind(this, "endDate");

        return (<div style={{ backgroundColor: "#243036", paddingLeft: "16px", paddingRight: "16px" }}>
            <div style={{ float: "left", width: "120px" }} >
                <Select inputStyle={SelectInputStyle} labelStyle={SelectLabelStyle} iconStyle={SelectIconStyle} adapter={this.filterAdapter} hint={"Filter Type"} onSelected={typeHandleChange} />
            </div>
            <div style={{ float: "right", display: "block" }} >
                <div style={{ float: "left", display: "inline-block" }} >
                    <DatePicker theme={DatePickerTheme} label="Start Date" maxDate={today} value={this.state.startDate} onChange={startHandleChange} />
                </div>
                <p style={{ color: "rgb(255, 255, 255)", fontSize: "26px", margin: "auto 10px", marginTop: "20px", display: "inline-block" }}>-</p>
                <div style={{ float: "right", display: "inline-block" }} >
                    <DatePicker theme={DatePickerTheme} label="End Date" maxDate={today} value={this.state.endDate} onChange={endHandleChange} />
                </div>
            </div>
            <div style={{ clear: "both" }} />
        </div>);
    }
}