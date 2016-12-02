import * as React from "react";

import { LOG_LEVELS } from "../../constants";

import { ComponentSelector, SelectableComponent } from "../../components/ComponentSelector";
import { FormInput } from "../../components/FormInput";
import { Select, SelectAdapter } from "../../components/Select";

import Log from "../../models/log";

export interface LogsFilterComponentProps {
    onFilter: (filter?: FilterType) => void;
}

export interface FilterType {
    type: string;
    filter: (item: Log) => boolean;
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
        this.filterComponents.push(new IDFilterComponent(this.props.onFilter));
        this.filterComponents.push(new TypeFilterComponent(this.props.onFilter));

        this.selectableComponents = [];
        for (let fc of this.filterComponents) {
            this.selectableComponents.push(fc.comp);
        }
    }

    onSelected(index: number, component: SelectableComponent) {
        let filtComp = this.filterComponents[index];
        filtComp.startFilter();
    }

    onUnselected() {
        this.props.onFilter(undefined);
    }

    render() {
        return (<ComponentSelector components={this.selectableComponents} onSelected={this.onSelected.bind(this)} onUnselected={this.onUnselected.bind(this)} />);
    }
}

export default LogsFilterComponent;

class DateFilter implements FilterType {
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

class IDFilter implements FilterType {
    id: string;

    constructor() {
        this.id = "";
    }

    get type(): string {
        return "ID";
    }

    get filter(): (item: Log) => boolean {
        let id = this.id;
        return function (item: Log): boolean {
            console.info("Checking " + ((item) ? item.id : "undefined") + " with " + id);
            let matches = item.id.match("^.*" + id + ".*$");
            console.info("Matches " + matches);
            let bool = id.length === 0 || (matches && matches.length > 0);
            return bool;
        };
    }
}

class TypeFilter implements FilterType {
    logType?: string;

    constructor() {
        this.logType = undefined;
    }

    get type(): string {
        return "Log Type";
    }

    get filter(): (item: Log) => boolean {
        let type = this.type;
        return function(item: Log): boolean {
            return type === undefined || item.log_type.match(type).length > 0;
        };
    }
}

abstract class FilterComponent {

    onFilter: (type: FilterType) => void;
    comp: SelectableComponent;

    constructor(onFilter: (type: FilterType) => void) {
        this.onFilter = onFilter;
    }

    abstract filterType(): FilterType;

    startFilter() {
        this.onFilter(this.filterType());
    }
}

class IDFilterComponent extends FilterComponent {

    filter: IDFilter;
    input: FormInput;

    constructor(onFilter: (type: FilterType) => void) {
        super(onFilter);
        this.filter = new IDFilter();
        this.comp = new SingleInputSelectableComponent("ID", this.handleChange.bind(this));
    }

    handleChange(value: string) {
        this.filter.id = value;
        this.startFilter();
    }

    filterType(): FilterType {
        return this.filter;
    }
}

class TypeFilterComponent extends FilterComponent implements SelectAdapter<LOG_LEVELS> {

    types: LOG_LEVELS[];
    filter: TypeFilter;
    input: FormInput;

    constructor(onFilter: (type: FilterType) => void) {
        super(onFilter);
        this.types = [];
        this.types.push("INFO");
        this.types.push("DEBUG");
        this.types.push("WARN");
        this.types.push("ERROR");
        this.filter = new TypeFilter();
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

    filterType(): FilterType {
        return this.filter;
    }

    onSelected(item: LOG_LEVELS) {
        this.filter.logType = item;
        this.startFilter();
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
        return (<FormInput autoFocus={true} label={this.title} type="text" value="" onChange={this.handleChange.bind(this)} />);
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
        return (<Select autoFocus={true} hint={this.hint} adapter={this.adapter} onSelected={this.onSelected.bind(this)} />);
    }
}