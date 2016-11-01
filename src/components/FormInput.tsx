import * as classNames from "classnames";
import * as React from "react";

import util from "../utils";
import MDLComponent from "./MDLComponent";

interface FormInputProps {
    label: string;
    type: "text" | "password";
    floatingLabel?: boolean;
    onChange: (event: React.FormEvent) => any;
    value: string;
    style?: React.CSSProperties;
    readOnly?: boolean;
    autoComplete?: "off" | "on" ;
}

export default class FormInput extends MDLComponent<FormInputProps, any> {

    classes() {
        return classNames("mdl-textfield mdl-js-textfield", {
            "mdl-textfield--floating-label": this.props.floatingLabel
        });
    }

    render() {
        return (
            <div
                className={this.classes()}
                style={this.props.style}>
                <input
                    autoComplete={this.props.autoComplete ? this.props.autoComplete : "off"}
                    className="mdl-textfield__input"
                    type={this.props.type}
                    id={util.stringToCamelCase(this.props.label)}
                    value={this.props.value}
                    onChange={this.props.onChange}
                    readOnly={this.props.readOnly}/>
                <label
                    className="mdl-textfield__label"
                    htmlFor={util.stringToCamelCase(this.props.label)}>
                    {this.props.label}
                </label>
            </div>
        );
    }
}