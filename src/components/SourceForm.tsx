import * as React from "react";

import Source from "../models/source";

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
                    <div
                        className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label"
                        style={this.textFieldStyleOverrides()}>
                        <input
                            autoComplete="off"
                            className="mdl-textfield__input"
                            type="text"
                            id="sourceName"
                            value={this.state.source.name}
                            onChange={this.onChange.bind(this)} />
                        <label
                            className="mdl-textfield__label"
                            htmlFor="sourceName">
                            Name
                        </label>
                    </div>
                    <div
                        className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label"
                        style={this.textFieldStyleOverrides()}>
                        <input
                            style={{
                                fontFamily: "monospace"
                            }}
                            autoComplete="off"
                            className="mdl-textfield__input"
                            type="text"
                            id="sourceId"
                            value={this.state.source.id}
                            onChange={this.onChange.bind(this)}
                            readOnly/>
                        <label
                            className="mdl-textfield__label"
                            htmlFor="sourceId">
                            Secret Key
                        </label>
                    </div>
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