import * as React from "react";
import { connect } from "react-redux";
import { goBack, push, RouterAction } from "react-router-redux";

import { createSourceSuccess, CreateSourceSuccess } from "../actions/source";
import Button from "../components/Button";
import { Cell, Grid } from "../components/Grid";
import { NameRule, SourceForm } from "../components/SourceForm";
import Source from "../models/source";
import { State } from "../reducers";
import service from "../services/source";

/**
 * Validator class for the SourceForm.  Exported for direct testing.
 */
export class SourceNameRule implements NameRule {
    regex: RegExp = /^[a-zA-Z0-9-][a-zA-Z0-9- ]+[a-zA-Z0-9-]$/;
    errorMessage = (input: string): string => {
        return "The name must have three letters and contain no special characters except hyphen.";
    }
}

interface NewSourceProps {
    newSource: (source: Source) => CreateSourceSuccess;
    goToLogs: (source: Source) => RouterAction;
    sources: Source[];
}

interface NewSourceState {
    source: Source | undefined;
    error: Error | undefined;
};

function mapStateToProps(state: State.All) {
    return {
        sources: state.source.sources
    };
}

function mapDispatchToProps(dispatch: Redux.Dispatch<any>) {
    return {
        newSource: function(source: Source): CreateSourceSuccess {
            return dispatch(createSourceSuccess(source));
        },

        goToLogs: function (source: Source): RouterAction {
            return dispatch(push("/skills/" + source + "/logs"));
        }
    };
}

export class NewSourcePage extends React.Component<NewSourceProps, NewSourceState> {

    constructor(props: NewSourceProps) {
        super(props);
        this.state = {
            source: undefined,
            error: undefined
        };
    }

    createSource(source: Source) {
        return service.createSource(source)
        .then((newSource: Source) => {
            console.info("NEW SSOURCE " + newSource.secretKey);
            this.props.newSource(newSource);
            this.setState({
                source: newSource,
                error: undefined
            });
        }).catch((err: Error) => {
            console.info("ERROR CREATING");
            this.setState({
                source: undefined,
                error: new Error("Unable to create source at this time.")
            });
        });
    }

    goToLogs() {
        console.info("GOING TO LOGS " + this.state.source);
        this.props.goToLogs(this.state.source);
    }

    goBack() {
        this.setState({
            source: undefined,
            error: undefined
        });
    }

    render() {
        let createSource = this.state.source === undefined;

        let header = (this.props.sources.length === 0) ? (
            <Grid>
                <Cell col={12}>
                    <h5>Enter the name of your skill and then click Create Skill.</h5>
                    <h5>Then, to start sending logs, follow the instructions on how to integrate the SDK into your skill.</h5>
                </Cell>
            </Grid>
        ) : (<div />);

        let bottomHalf = (createSource) ?
            (<NewSkillForm createSource={this.createSource.bind(this)} />) :
            (<CodeForm source={this.state.source} goToLogs={this.goToLogs.bind(this)} goBack={this.goBack.bind(this)} />);

        return (
            <div>
                {header}
                {bottomHalf}
            </div>
        );
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(NewSourcePage);

interface NewSkillProps {
    createSource: (source: Source) => Redux.ThunkAction<any, any, any>;
    error?: Error;
}

class NewSkillForm extends React.Component<NewSkillProps, any> {

    render(): JSX.Element {
        return (
            <Grid>
                <Cell col={12}>
                    <h4>New Skill Setup</h4>
                </Cell>
                <Cell col={12}>
                    <p>Currently all skills must be at least three characters in length and not contain any special characters.</p>
                </Cell>
                <Cell col={12}>
                    <SourceForm
                        createSource={this.props.createSource}
                        error={this.props.error}
                        nameRule={new SourceNameRule()} />
                </Cell>
            </Grid>
        );
    }
}

interface CodeFormProps {
    source: Source | undefined;
    goToLogs: (source: Source) => void;
    goBack: () => void;
}

interface CodeFormState {
    secretKey: string;
}

class CodeForm extends React.Component<CodeFormProps, CodeFormState> {

    constructor(props: CodeFormProps) {
        super(props);

        this.state = {
            secretKey: CodeForm.codeSecretKey(props.source)
        };
    }

    componentWillReceiveProps(nextProps: CodeFormProps, context: any) {
        this.setState({
            ...this.state, ...{
                secretKey: CodeForm.codeSecretKey(nextProps.source)
            }
        });
    }

    goToLogs() {
        this.props.goToLogs(this.props.source);
    }

    codeStyle(): React.CSSProperties {
        return {
            margin: "10px",
            padding: "20px",
            backgroundColor: "#CFD8DC",
            color: "#263238",
            whiteSpace: "pre-line"
        };
    }

    static codeSecretKey(source: Source | undefined): string {
        let defaultKey = "/* secret key */";
        return (source !== undefined && source.secretKey !== undefined) ? source.secretKey : defaultKey;
    }

    render(): JSX.Element {
        return (
            <Grid>
                <Cell col={12}>
                    <h4>Integrate the SDK</h4>
                    <p>Install the dependency</p>
                    <pre style={this.codeStyle()}>{`$npm install bespoken-tools --save `}</pre>
                    <p>Import bst to your index.js</p>
                    <pre style={this.codeStyle()}>{`var bst = require('bespoken-tools');`}</pre>
                    <p> Wrap your <code>exports.handler</code></p>
                    <pre style={this.codeStyle()}>{`exports.handler = bst.Logless.capture("` + this.state.secretKey + `", function (event, context) {
                                // Lambda code goes here
                            });
                        `}</pre>
                </Cell>
                {(this.props.source) ?
                    (<div><Cell col={12}>
                        <Button accent={true} raised={true} onClick={this.goToLogs.bind(this)}>Next: Check for Logs</Button>
                    </Cell>
                        <Cell col={12}>
                            <Button raised={true} onClick={this.props.goBack}>Create Another</Button>
                        </Cell>
                    </div>)
                    : (<div />)}
            </Grid>
        );
    }
}