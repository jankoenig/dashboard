import * as classNames from "classnames";
import * as React from "react";

import Button from "./Button";
import { Menu, MenuItem } from "./Menu";

export interface SelectAdapter<T> {
    getCount(): number;
    getItem(index: number): T;
    getTitle(index: number): string;
}

export interface SelectListener<T> {
    onSelected(item: T, index: number): void;
}

export interface SelectProps<T> {
    hint: string;
    adapter: SelectAdapter<T>;
    selectListener: SelectListener<T>;
}

interface SelectState {
    list: React.ReactNode[];
}

export class Select extends React.Component<SelectProps<any>, SelectState> {

    inputRef: Element;
    boundChangeListener: any;

    constructor(props: SelectProps<any>) {
        super(props);
        this.state = {
            list: []
        };
        this.setAdapter(props);
    }

    componentWillReceiveProps(nextProps: SelectProps<any>, nextContext: any): void {
        this.setAdapter(nextProps);
    }

    setAdapter(props: SelectProps<any>) {
        this.state.list = [];

        let maxCount = props.adapter.getCount();
        for (let count = 0; count < maxCount; ++count) {
            let title = props.adapter.getTitle(count);
            this.state.list.push((
                <li className="mdl-menu__item" key={count}>{title}</li>
            ));
        }
    }

    componentDidMount() {
        console.info("MOUNT");
        // The input dom of the getmdl-select dispatches an "onchange" event on each selection.
        this.boundChangeListener = this.handleChange.bind(this);
        this.inputRef.addEventListener("onchange", this.boundChangeListener);
    }

    componentWillUnmount() {
        this.inputRef.removeEventListener("onchange", this.boundChangeListener);
    }

    handleChange(obj: any) {
        let index = obj.detail.index;
        let item = this.props.adapter.getItem(index);
        this.props.selectListener.onSelected(index, item);
    }

    handleRefBind(input: Element) {
        console.info("BIND");
        if (input) {
            this.inputRef = input;
        }
    }

    render() {
        return (
            <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label getmdl-select getmdl-select__fix-height getmdl-select__fullwidth">
                <input ref={this.handleRefBind.bind(this)} className="mdl-textfield__input" type="text" id="check-selection" value="Select" readOnly tabIndex={-1} />
                <label htmlFor="check-selection">
                    <i className="mdl-icon-toggle__label material-icons">keyboard_arrow_down</i>
                </label>
                <label htmlFor="check-selection" className="mdl-textfield__label">Country</label>
                <ul htmlFor="check-selection" className="mdl-menu mdl-menu--bottom-left mdl-js-menu">
                    {this.state.list}
                </ul>
            </div>
        );
    }
}

export default Select;