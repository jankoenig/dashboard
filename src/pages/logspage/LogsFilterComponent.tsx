import * as React from "react";

import { ComponentSelector, SelectableComponent } from "../../components/ComponentSelector";
import { FormInput } from "../../components/FormInput";

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
    comp: SelectableComponent;

    constructor(onFilter: (type: FilterType) => void) {
        super(onFilter);
        this.filter = new IDFilter();
        this.comp = new SingleSelectableComponent("ID", this.handleChange.bind(this));
    }

    handleChange(value: string) {
        this.filter.id = value;
        this.startFilter();
    }

    filterType(): FilterType {
        return this.filter;
    }
}

class SingleSelectableComponent implements SelectableComponent {

    title: string;
    onChange: (input: string) => void;

    constructor(title: string, onChange: (input: string) => void) {
        this.title = title;
        this.onChange = onChange;
    }

    handleChange(formEvent: React.FormEvent) {
        let target = formEvent.target as HTMLSelectElement;
        console.info("TARGET " + target.value);
        this.onChange(target.value);
    }

    get component(): JSX.Element {
        console.info("GETTING COMPONENT");
        return (<FormInput autoFocus={true} label={this.title} type="text" value="" onChange={this.handleChange.bind(this)} />);
    }
}