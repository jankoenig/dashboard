import * as moment from "moment";
import * as React from "react";
import DatePicker from "react-toolbox/lib/date_picker";

import * as Filters from "./Filters";

import { ComponentSelector, SelectableComponent } from "../../components/ComponentSelector";
import { FormInput } from "../../components/FormInput";
import { Select, SelectAdapter } from "../../components/Select";
import { LOG_LEVELS } from "../../constants";

export interface LogsFilterComponentProps {
    onFilter: (filter?: Filters.FilterType) => void;
}

interface LogsFilterComponentState {
    selectedComponent: SelectableComponent;
}

export class LogsFilterComponent extends React.Component<LogsFilterComponentProps, LogsFilterComponentState> {

    filterComponents: FilterComponent[];
    selectableComponents: SelectableComponent[];

    constructor(props: LogsFilterComponentProps) {
        super(props);
        this.filterComponents = [];
        this.filterComponents.push(undefined);
        this.filterComponents.push(new IDFilterComponent(this.props.onFilter));
        this.filterComponents.push(new TypeFilterComponent(this.props.onFilter));
        this.filterComponents.push(new DateFilterComponent(this.props.onFilter));

        this.selectableComponents = [];
        for (let fc of this.filterComponents) {
            this.selectableComponents.push((fc) ? fc.comp : undefined);
        }
    }

    onSelected(index: number, component: SelectableComponent) {
        let filtComp = this.filterComponents[index];
        if (filtComp) {
            filtComp.startFilter();
        } else {
            this.props.onFilter(undefined);
        }
    }

    onUnselected() {
        this.props.onFilter(undefined);
    }

    render() {
        return (<ComponentSelector components={this.selectableComponents} onSelected={this.onSelected.bind(this)} />);
    }
}

export default LogsFilterComponent;

abstract class FilterComponent {

    onFilter: (type: Filters.FilterType) => void;
    comp: SelectableComponent;

    constructor(onFilter: (type: Filters.FilterType) => void) {
        this.onFilter = onFilter;
    }

    abstract filterType(): Filters.FilterType;

    startFilter() {
        this.onFilter(this.filterType());
    }
}

class IDFilterComponent extends FilterComponent {

    filter: Filters.IDFilter;
    input: FormInput;

    constructor(onFilter: (type: Filters.FilterType) => void) {
        super(onFilter);
        this.filter = new Filters.IDFilter();
        this.comp = new SingleInputSelectableComponent("ID", this.handleChange.bind(this));
    }

    handleChange(value: string) {
        this.filter.id = value;
        this.startFilter();
    }

    filterType(): Filters.FilterType {
        return this.filter;
    }
}

class TypeFilterComponent extends FilterComponent implements SelectAdapter<LOG_LEVELS> {

    types: LOG_LEVELS[];
    filter: Filters.TypeFilter;
    input: FormInput;

    constructor(onFilter: (type: Filters.FilterType) => void) {
        super(onFilter);
        this.types = [];
        this.types.push(undefined);
        this.types.push("INFO");
        this.types.push("DEBUG");
        this.types.push("WARN");
        this.types.push("ERROR");
        this.filter = new Filters.TypeFilter();
        this.comp = new SingleSelectSelectableComponent<string>("Type", this, this.onSelected.bind(this));
    }

    getCount(): number {
        return this.types.length;
    }

    getItem(index: number): LOG_LEVELS {
        return this.types[index];
    }

    getTitle(index: number): string {
        return this.types[index];
    }

    filterType(): Filters.FilterType {
        return this.filter;
    }

    onSelected(item: LOG_LEVELS) {
        this.filter.logType = item;
        this.startFilter();
    }
}

class DateFilterComponent extends FilterComponent {
    filter: Filters.DateFilter;

    constructor(onFilter: (type: Filters.FilterType) => void) {
        super(onFilter);
        this.filter = new Filters.DateFilter();
        this.comp = new DateComponent("Date", this.onChange.bind(this));
    }

    onChange(startDate: Date, endDate: Date) {
        this.filter.startDate = moment(startDate);
        this.filter.endDate = moment(endDate);
        this.startFilter();
    }

    filterType(): Filters.FilterType {
        return this.filter;
    }
}

class DateComponent implements SelectableComponent {
    title: string;
    format: string;
    startDate: Date;
    endDate: Date;
    onChange: (startDate: Date, endDate: Date) => void;

    constructor(title: string, onChange: (startDate: Date, endDate: Date) => void, startDate: Date = undefined, endDate: Date = new Date()) {
        this.title = title;
        this.onChange = onChange;
        this.startDate = startDate;
        this.endDate = endDate;
    }

    handleChange(item: string, value: Date) {
        // Right now these don't allow time so going to assume the beginning and the end of whatever day it's at.
        if (item === "startDate") {
            this.startDate = value;
            this.startDate.setHours(0, 0, 0, 0);
        } else if (item === "endDate") {
            this.endDate = value;
            this.endDate.setHours(23, 59, 59, 999);
        }
        this.onChange(this.startDate, this.endDate);
    }

    get component(): JSX.Element {
        return (<div>
                    <DatePicker label="Start" onChange={this.handleChange.bind(this, "startDate")} value={this.startDate} />
                    <DatePicker label="End" onChange={this.handleChange.bind(this, "endDate")} value={this.endDate} />
                </div>);
    }
}

class SingleInputSelectableComponent implements SelectableComponent {

    title: string;
    onChange: (input: string) => void;

    constructor(title: string, onChange: (input: string) => void) {
        this.title = title;
        this.onChange = onChange;
    }

    handleChange(formEvent: React.FormEvent) {
        let target = formEvent.target as HTMLSelectElement;
        this.onChange(target.value);
    }

    get component(): JSX.Element {
        return (<FormInput label={this.title} type="text" value="" onChange={this.handleChange.bind(this)} autoFocus={true} />);
    }
}

class SingleSelectSelectableComponent<T> implements SelectableComponent {
    hint: string;
    adapter: SelectAdapter<T>;
    selectListener: (item?: T) => void;

    constructor(hint: string, adapter: SelectAdapter<T>, onSelected: (item?: T) => void) {
        this.hint = hint;
        this.adapter = adapter;
        this.selectListener = onSelected;
    }

    onSelected(item: T, index: number) {
        this.selectListener(item);
    }

    get title(): string {
        return this.hint;
    }

    get component(): JSX.Element {
        return (<Select hint={this.hint} adapter={this.adapter} onSelected={this.onSelected.bind(this)} />);
    }
}