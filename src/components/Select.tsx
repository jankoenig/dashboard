import * as classNames from "classnames";
import * as React from "react";

import Button from "./Button";
import { Menu, MenuItem } from "./Menu";

export interface SelectAdapter<T> {
    getCount(): number;
    getItem(index: number): T;
    getTitle(item: T, index: number): string;
}

export interface SelectProps<T> {
    hint: string;
    adapter: SelectAdapter<T>;
}

interface SelectState {
    list: React.ReactNode[];
}

export class Select extends React.Component<SelectProps<any>, SelectState> {

    constructor(props: SelectProps<any>) {
        super(props);
        this.state = {
            list: []
        };
    }

    componentWillReceiveProps?(nextProps: SelectProps<any>, nextContext: any): void {
        this.state.list = [];

        let maxCount = this.props.adapter.getCount();
        for (let count = 0; count < maxCount; ++count) {
            let item = this.props.adapter.getItem(count);
            let title = this.props.adapter.getTitle(item, count);
            this.state.list.push((
                <li className="mdl-menu__item" key={count}>{title}</li>
            ));
        }
    }

    render() {
        return (
            <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label getmdl-select getmdl-select__fix-height getmdl-select__fullwidth">
                <input className="mdl-textfield__input" type="text" id="check-selection" value="Select" readOnly tabIndex={-1} />
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