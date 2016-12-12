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
        types.push({ type: "WARN", title: "Warning"});
        types.push({ type: "ERROR", title: "Error"});
        this.filterAdapter = new FilterTypeAdapter(types);
    }

    render(): JSX.Element {
        let today = new Date();

        return (<div style={{ backgroundColor: "#243036", paddingLeft: "16px", paddingRight: "16px" }}>
            <div style={{ float: "left" }} >
                <Select adapter={this.filterAdapter} hint={"Filter Type"} />
            </div>
            <div style={{ float: "right" }} >
                <div style={{ float: "left" }} >
                    <DatePicker theme={DatePickerTheme} label="Start Date" maxDate={today} />
                </div>
                <div style={{ float: "left" }} >
                    <p style={{ color: "rgb(255, 255, 255)", fontSize: "26px", marginRight: "10px", marginLeft: "10px" }}>-</p>
                </div>
                <div style={{ float: "right" }} >
                    <DatePicker theme={DatePickerTheme} label="End Date" maxDate={today} value={today} />
                </div>
            </div>
            <div style={{ clear: "both" }} />
        </div>);
    }
}