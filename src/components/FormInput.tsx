import * as classNames from "classnames";
import * as React from "react";

import util from "../utils";
import MDLComponent from "./MDLComponent";

/**
 * Class that can be included to display custom messages to the user based on the input.
 */
export interface ErrorHandler {
    /**
     * The regex to set fo the form to check against.  An undefined means that any text will be accepted.
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
    floatingLabel?: boolean;
    onChange: (event: React.FormEvent) => any;
    value: string;
    style?: React.CSSProperties;
    readOnly?: boolean;
    autoComplete?: "off" | "on" ;
    hidden?: boolean;
    error?: ErrorHandler;
}

interface FormState {
    errorMsg?: string;
}

export class FormInput extends MDLComponent<FormInputProps, FormState> {

    constructor() {
        super();
        this.state = {
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
        if (this.props.error !== undefined) {
            let target = event.target as HTMLSelectElement;
            errorMsg = this.props.error.errorMessage(target.value);
        }
        this.setState({
            errorMsg: errorMsg
        });
        this.props.onChange(event);
    }

    render() {
        let pattern: string = undefined;
        if (this.props.error !== undefined) {
            pattern = this.props.error.regex.source;
        }

        return (
            <div
                className={this.classes()}
                style={this.props.style}
                hidden={this.props.hidden}>
                <input
                    autoComplete={this.props.autoComplete ? this.props.autoComplete : "off"}
                    className="mdl-textfield__input"
                    type={this.props.type}
                    id={util.stringToCamelCase(this.props.label)}
                    value={this.props.value}
                    pattern={pattern}
                    onChange={this.onFormChange.bind(this)}
                    readOnly={this.props.readOnly}/>
                <label
                    className="mdl-textfield__label"
                    htmlFor={util.stringToCamelCase(this.props.label)}>
                    {this.props.label}
                </label>
                <span className="mdl-textfield__error">{this.state.errorMsg}</span>
            </div>
        );
    }
}

export default FormInput;