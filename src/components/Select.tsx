import * as classNames from "classnames";
import * as React from "react";

export interface SelectProps {
    hint: string;
    selections: string[];
}

interface SelectState {

}

const DIV_CLASSES: string = "mdl-select mdl-js-select mdl-select--floating-label";
const SELECT_CLASS: string = "mdl-select__input";

class Select extends React.Component<SelectProps, SelectState> {

    constructor(props: SelectProps) {
        super(props);
        this.state = {
        };
    }

    get divClasses(): string {
        return classNames(DIV_CLASSES);
    }

    get selectClasses(): string {
        return classNames(SELECT_CLASS);
    }

    render() {
        let list: React.ReactNode[] = [];

        for (let selection in this.props.selections) {
            list.push((
                        <Option value={selection.replace(/\s/, "") } title={ selection } />
                    )
                );

        }

        return (
            <form action="#">
                <div class={this.divClasses}>
                    <select class={this.selectClasses} id="selection" name={this.props.hint}>
                        {list}
                    </select>
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
        return (
            <option value={this.props.value}>{this.props.title}</option>
        );
    }
}