import * as React from "react";

import Source from "../models/source";
import FormInput from "./FormInput";

interface SourceFormProps {
    name?: string;
    uuid?: string;
    error?: string;
    disable?: boolean;
    onChange?: (event: React.FormEvent) => any;
    createSource: (source: Source) => void;
}

interface SourceFormState {
    source: Source;
}

export default class SourceForm extends React.Component<SourceFormProps, SourceFormState> {

    constructor(props: SourceFormProps) {
        super(props);
        this.state = {
            // Setup an initial source
            source: new Source({ name: "" })
        };
    }

    textFieldStyleOverrides() {
        return {
            display: "block",
            width: "400px"
        };
    }

    onChange(event: React.FormEvent) {
        let target = event.target as HTMLSelectElement;
        this.setState({
            source: new Source({ name: target.value }),
        });
    }

    onClick(event: React.FormEvent) {
        this.props.createSource(this.state.source);
    }

    render() {
        return (
            <div>
                <form id="newSource">
                    <FormInput
                        style={this.textFieldStyleOverrides()}
                        type={"text"}
                        value={this.state.source.name}
                        onChange={this.onChange.bind(this)}
                        label={"Name"}
                        floatingLabel={true}
                        autoComplete={"off"} />
                    <FormInput style={this.textFieldStyleOverrides()}
                        type="text"
                        value={this.state.source.secretKey}
                        onChange={this.onChange.bind(this)}
                        label={"Secret Key"}
                        floatingLabel={true}
                        autoComplete={"off"}
                        readOnly={true}/>
                </form>
                <button
                    className="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect"
                    onClick={this.onClick.bind(this)}>
                    Create Skill
                </button>
            </div>
        );
    }
}