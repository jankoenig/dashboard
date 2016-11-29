import * as classNames from "classnames";
import * as React from "react";

export interface SelectProps {
    hint: string;
    selections: string[];
}

interface SelectState {
    list: React.ReactNode[];
}

const DIV_CLASSES: string = "mdl-select mdl-js-select mdl-select--floating-label";
const SELECT_CLASS: string = "mdl-select__input";

class Select extends React.Component<SelectProps, SelectState> {

    constructor(props: SelectProps) {
        super(props);
        this.state = {
            list: []
        };
    }

    get divClasses(): string {
        return classNames(DIV_CLASSES);
    }

    get selectClasses(): string {
        return classNames(SELECT_CLASS);
    }

    componentWillReceiveProps?(nextProps: SelectProps, nextContext: any): void {
        this.state.list = [];

        for (let selection in this.props.selections) {
            this.state.list.push((
                <Option value={selection.replace(/\s/, "")} title={selection} />
            ));
        }
    }

    render() {
        return (
            <form action="#">
                <div className={this.divClasses}>
                    <select className={this.selectClasses} id="selection" name={this.props.hint}>
                        {this.state.list}
                    </select>
                    <label class="mdl-select__label" for={this.props.hint}>{this.props.hint}</label>
                </div>
            </form>
        );
    }
}

export default Select;

interface OptionProps {
    value: string;
    title: string;
}

class Option extends React.Component<OptionProps, any> {

    render() {
        console.info("IN HERE");
        return (
            <option value={this.props.value}>{this.props.title}</option>
        );
    }
}