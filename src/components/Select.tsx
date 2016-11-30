import * as classNames from "classnames";
import * as React from "react";

import Button from "./Button";
import { Menu, MenuItem } from "./Menu";

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

    get selectLabelStyle(): any {
        return {
            bottom: "0",
            // color: rgba(0, 0, 0, 0.26),
            fontSize: "16px",
            left: "0",
            right: "0",
            pointerEvents: "none",
            position: "absolute",
            top: "24px",
            width: "100%",
            overflow: "hidden",
            whiteSpace: "nowrap",
            textAlign: "left"
        };
    }

    componentWillReceiveProps?(nextProps: SelectProps, nextContext: any): void {
        this.state.list = [];

        for (let selection in this.props.selections) {
            this.state.list.push((
                <MenuItem>{selection}</MenuItem>
            ));
        }
    }

    render() {
        return (
        <form action="#">
            <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label getmdl-select getmdl-select__fix-height getmdl-select__fullwidth">
                <input className="mdl-textfield__input" type="text" id="check-selection" value="Select" readOnly tabIndex={-1} />
                <label htmlFor="check-selection">
                    <i className="mdl-icon-toggle__label material-icons">keyboard_arrow_down</i>
                </label>
                <label htmlFor="check-selection" className="mdl-textfield__label">Country</label>
                <ul htmlFor="check-selection" className="mdl-menu mdl-menu--bottom-left mdl-js-menu">
                    <li className="mdl-menu__item" data-val="DE">Germany</li>
                    <li className="mdl-menu__item" data-val="BY">Belarus</li>
                    <li className="mdl-menu__item" data-val="RU">Russia</li>
                    <li className="mdl-menu__item" data-val="AA">Germany</li>
                    <li className="mdl-menu__item" data-val="BB">Belarus</li>
                    <li className="mdl-menu__item" data-val="CC">Russia</li>
                    <li className="mdl-menu__item" data-val="DD">Germany</li>
                    <li className="mdl-menu__item" data-val="EE">Belarus</li>
                    <li className="mdl-menu__item" data-val="FF">Russia</li>
                    <li className="mdl-menu__item" data-val="GG">Germany</li>
                    <li className="mdl-menu__item" data-val="HH">Belarus</li>
                    <li className="mdl-menu__item" data-val="RU">Russia</li>
                </ul>
            </div>
        </form>
        );
    }
}

export default Select;