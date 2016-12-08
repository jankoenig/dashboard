import * as classNames from "classnames";
import * as React from "react";

import StringUtil from "../utils/string";
import MDLComponent from "./MDLComponent";

/**
 * Class that can be included to display custom messages to the user based on the input.
 */
export interface ErrorHandler {
    /**
     * The regex to set to the form to check against.  An undefined means that any text will be accepted.
     */
    regex: RegExp;
    /**
     * If the input doesn't match the input prodided, this method will be called to retrieve the error message to display to the user.
     *
     * @param input
     *      The input that the user has shown.
     *
     */
    errorMessage: (input: string) => string | undefined;
}

interface FormInputProps {
    label: string;
    type: "text" | "password";
    value: string;
    autoFocus?: boolean;
    floatingLabel?: boolean;
    onChange?: (event: React.FormEvent) => any;
    style?: React.CSSProperties;
    readOnly?: boolean;
    autoComplete?: "off" | "on" ;
    hidden?: boolean;
    error?: ErrorHandler;
}

interface FormState {
    currentValue: string;
    errorMsg?: string;
}

export class FormInput extends MDLComponent<FormInputProps, FormState> {

    constructor(props: FormInputProps) {
        super(props);
        this.state = {
            currentValue: props.value,
            errorMsg: undefined
        };
    }

    classes() {
        return classNames("mdl-textfield mdl-js-textfield", {
            "mdl-textfield--floating-label": this.props.floatingLabel
        });
    }

    onFormChange(event: React.FormEvent) {
        let errorMsg: string = undefined;
        let target = event.target as HTMLSelectElement;
        if (this.props.error !== undefined) {
            errorMsg = this.props.error.errorMessage(target.value);
        }

        this.state.errorMsg = errorMsg;
        this.state.currentValue = target.value;
        this.setState(this.state);

        if (this.props.onChange) {
            this.props.onChange(event);
        }
    }

    render() {
        let pattern: string = undefined;
        if (this.props.error !== undefined) {
            pattern = this.props.error.regex.source;
        }

        let autoFocus: boolean = this.props.autoFocus || false;
        return (
            <div
                className={this.classes()}
                style={this.props.style}
                hidden={this.props.hidden}>
                <input
                    autoFocus={autoFocus}
                    autoComplete={this.props.autoComplete ? this.props.autoComplete : "off"}
                    className="mdl-textfield__input"
                    type={this.props.type}
                    id={StringUtil.stringToCamelCase(this.props.label)}
                    value={this.state.currentValue}
                    pattern={pattern}
                    onChange={this.onFormChange.bind(this)}
                    readOnly={this.props.readOnly}/>
                <label
                    className="mdl-textfield__label"
                    htmlFor={StringUtil.stringToCamelCase(this.props.label)}>
                    {this.props.label}
                </label>
                <span className="mdl-textfield__error">{this.state.errorMsg}</span>
            </div>
        );
    }
}

export default FormInput;