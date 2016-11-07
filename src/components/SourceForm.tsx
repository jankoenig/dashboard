import * as React from "react";

import Source from "../models/source";
import Button from "./Button";
import FormInput from "./FormInput";

interface SourceFormProps {
    name?: string;
    uuid?: string;
    error?: Error;
    creatingSource?: boolean;
    disable?: boolean;
    onChange?: (event: React.FormEvent) => any;
    nameRule: (name?: string) => boolean;
    createSource: (source: Source) => void;
}

interface SourceFormState {
    name: string;
    source?: Source;
}

export default class SourceForm extends React.Component<SourceFormProps, SourceFormState> {

    constructor(props: SourceFormProps) {
        super(props);
        this.state = {
            name: "",
            // Setup an initial source
            source: undefined
        };
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
        let valid = this.props.nameRule(target.value);
        this.setState({
            name: target.value,
            source: (valid) ? new Source({ name: target.value }) : undefined,
        });
    }

    onClick(event: React.FormEvent) {
        if (this.state.source) {
            this.props.createSource(this.state.source);
        }
    }

    render() {
        let secretKey = (this.state.source) ? this.state.source.secretKey : "";

        return (
            <div>
                <form id="newSource">
                    <FormInput
                        style={this.textFieldStyleOverrides()}
                        type={"text"}
                        value={this.state.name}
                        onChange={this.onNameChange.bind(this)}
                        label={"Name"}
                        floatingLabel={true}
                        autoComplete={"off"}
                        readOnly={this.props.disable} />
                    <FormInput style={this.textFieldStyleOverrides()}
                        type={"text"}
                        value={secretKey}
                        onChange={this.onSecretChange.bind(this)}
                        label={"Secret Key"}
                        floatingLabel={true}
                        autoComplete={"off"}
                        readOnly={true} />
                </form>
                {!this.props.error ? (
                    <p> {this.props.error } </p>
                ) : undefined }
                {!this.props.disable ? (
                    <Button colored={true} ripple={true} raised={true} onClick={this.onClick.bind(this)}>Create Skill</Button>
                ) : undefined}
            </div>
        );
    }
}