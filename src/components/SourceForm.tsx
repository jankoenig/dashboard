import * as React from "react";

import Source from "../models/source";
import Noop from "../utils/Noop";
import Button from "./Button";
import { ErrorHandler, FormInput } from "./FormInput";

export interface NameRule extends ErrorHandler {
    // Passing up the ErrorHandler interface so our parents don't have to know about it.
}

interface SourceFormProps {
    name?: string;
    error?: Error;
    creatingSource?: boolean;
    onChange?: (name: string) => any;
    nameRule: NameRule;
    createSource: (source: Source) => void;
}

interface SourceFormState {
    name: string;
    source?: Source;
}

export class SourceForm extends React.Component<SourceFormProps, SourceFormState> {

    static defaultProps = {
        name: "",
        error: "",
        creatingSource: "",
        onChange: Noop,
        nameRule: { regex: new RegExp(".*"), errorMessage: function(input: string): undefined { return undefined; }}
    };

    constructor(props: SourceFormProps) {
        super(props);
        this.state = {
            name: "",
            // Setup an initial source
            source: undefined
        };

        this.onNameChange = this.onNameChange.bind(this);
        this.onClick = this.onClick.bind(this);
    }

    textFieldStyleOverrides() {
        return {
            display: "block",
            width: "400px"
        };
    }

    onSecretChange(event: React.FormEvent) {
        // Doing nothing right now.
    }

    onNameChange(event: React.FormEvent) {
        let target = event.target as HTMLSelectElement;
        let valid = this.props.nameRule.regex.test(target.value);
        this.setState({
            name: target.value,
            source: (valid) ? new Source({ name: target.value }) : undefined,
        });

        this.props.onChange(target.value);
    }

    onClick() {
        if (this.state.source) {
            this.props.createSource(this.state.source);
        }
    }

    render() {
        return (
            <div>
                <form id="newSource">
                    <FormInput
                        style={this.textFieldStyleOverrides()}
                        type={"text"}
                        value={this.state.name}
                        onChange={this.onNameChange}
                        label={"Name"}
                        floatingLabel={true}
                        autoComplete={"off"}
                        error={this.props.nameRule} />
                </form>
                {!this.props.error ? (
                    <p> {this.props.error} </p>
                ) : <div />}
                <Button colored={true} ripple={true} raised={true} onClick={this.onClick}>Create Source</Button>
            </div>
        );
    }
}

export default SourceForm;
