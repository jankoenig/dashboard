import * as moment from "moment";
import * as React from "react";
import DatePicker from "react-toolbox/lib/date_picker";

import * as Filters from "./Filters";

import { ComponentSelector, SelectableComponent } from "../../components/ComponentSelector";
import { FormInput } from "../../components/FormInput";
import { Select, SelectAdapter } from "../../components/Select";
import { LOG_LEVELS } from "../../constants";

const DatePickerTheme = require("./themes/datepicker-input");

export interface FilterProps {

}

interface FilterState {
    startDate?: Date;
    endDate?: Date;
    selectedType?: FilterType;
}

interface FilterType {
    type: string;
    title: string;
}

class FilterTypeAdapter implements SelectAdapter<FilterType> {
    filterTypes: FilterType[];

    constructor(types: FilterType[]) {
        this.filterTypes = types;
    }

    getCount(): number {
        return this.filterTypes.length;
    }

    getItem(index: number): FilterType {
        return this.filterTypes[index];
    };

    getTitle(index: number): string {
        let type = this.filterTypes[index];
        return (type !== undefined) ? type.title : undefined;
    };
}

export class FilterBar extends React.Component<FilterProps, FilterState> {
    filterAdapter: FilterTypeAdapter;

    constructor(props: FilterProps) {
        super(props);
        let types: FilterType[] = [];
        types.push(undefined);
        types.push({ type: "INFO", title: "Info" });
        types.push({ type: "DEBUG", title: "Debug" });
        types.push({ type: "WARN", title: "Warning" });
        types.push({ type: "ERROR", title: "Error" });
        this.filterAdapter = new FilterTypeAdapter(types);

        this.state = {};
    }

    handleChange(item: string, value: Date) {
        // Right now these don't allow time so going to assume the beginning and the end of whatever day it's at.
        if (item === "startDate") {
            this.state.startDate = value;
            this.state.startDate.setHours(0, 0, 0, 0);
        } else if (item === "endDate") {
            this.state.endDate = value;
            this.state.endDate.setHours(23, 59, 59, 999);
        }
        this.setState(this.state);
    }

    render(): JSX.Element {
        let today = new Date();
        let startHandleChange = this.handleChange.bind(this, "startDate");
        let endHandleChange = this.handleChange.bind(this, "endDate");

        return (<div style={{ backgroundColor: "#243036", paddingLeft: "16px", paddingRight: "16px" }}>
            <div style={{ float: "left" }} >
                <Select adapter={this.filterAdapter} hint={"Filter Type"} />
            </div>
            <div style={{ float: "right" }} >
                <div style={{ float: "left" }} >
                    <DatePicker theme={DatePickerTheme} label="Start Date" maxDate={today} value={this.state.startDate} onChange={startHandleChange} />
                </div>
                <div style={{ float: "left" }} >
                    <p style={{ color: "rgb(255, 255, 255)", fontSize: "26px", marginRight: "10px", marginLeft: "10px" }}>-</p>
                </div>
                <div style={{ float: "right" }} >
                    <DatePicker theme={DatePickerTheme} label="End Date" maxDate={today} value={this.state.endDate} onChange={endHandleChange} />
                </div>
            </div>
            <div style={{ clear: "both" }} />
        </div>);
    }
}