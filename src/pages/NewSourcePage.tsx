import * as React from "react";
import { connect } from "react-redux";
import { Link } from "react-router";

import { createSource } from "../actions/source";
import Button from "../components/Button";
import { Cell, Grid } from "../components/Grid";
import { NameRule, SourceForm} from "../components/SourceForm";
import Source from "../models/source";
import { State } from "../reducers";

interface NewSourceProps {
    createSource: (source: Source) => Redux.ThunkAction<any, any, any>;
    newSource: Source | undefined;
    error: Error | undefined;
    sourceRequest: boolean;
    sources: Source[];
}

/**
 * Validator class for the SourceForm.  Exported for direct testing.
 */
export class SourceNameRule implements NameRule {
    regex: RegExp = /^[a-zA-Z0-9-][a-zA-Z0-9- ]+[a-zA-Z0-9-]$/;
    errorMessage = (input: string): string => {
        return "The name must have three letters and contain no special characters except hyphen.";
    }
}

function mapStateToProps(state: State.All) {
    return {
        newSource: state.source.newSource,
        error: state.source.error,
        sourceRequest: state.source.sourceRequest,
        sources: state.source.sources
    };
}

function mapDispatchToProps(dispatch: Redux.Dispatch<any>) {
    return {
        createSource: function (source: Source) {
            return dispatch(createSource(source));
        }
    };
}

export class NewSourcePage extends React.Component<NewSourceProps, any> {

    createSource(source: Source) {
        this.props.createSource(source);
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

    codeSecretKey(): string {
        let secretKey: string = "/* secret key */";
        if (this.props.newSource) {
            secretKey = this.props.newSource.secretKey;
        }
        return secretKey;
    }

    render() {
        return (
            <div>
                {this.props.sources.length === 0 ? (
                    <Grid>
                        <Cell col={12}>
                            <h5>Enter the name of your skill and then click Create Skill.</h5>
                            <h5>Then, to start sending logs, follow the instructions on how to integrate the SDK into your skill.</h5>
                        </Cell>
                    </Grid>
                ) : undefined}
                <Grid>
                    <Cell col={12}>
                        <h4>New Skill Setup</h4>
                    </Cell>
                    <Cell col={12}>
                        <p>Currently all skills must be at least three characters in length and not contain any special characters.</p>
                    </Cell>
                </Grid>
                <Grid>
                    <Cell col={12}>
                        <SourceForm
                            createSource={this.createSource.bind(this)}
                            disable={this.props.newSource ? true : false}
                            error={this.props.error}
                            nameRule={new SourceNameRule()} />
                    </Cell>
                </Grid>
                <Grid>
                    <Cell col={12}>
                        <h4>Integrate the SDK</h4>
                        <p>Install the dependency</p>
                        <pre style={this.codeStyle()}>{`$npm install bespoken-tools --save `}</pre>
                        <p>Import bst to your index.js</p>
                        <pre style={this.codeStyle()}>{`var bst = require('bespoken-tools');`}</pre>
                        <p> Wrap your <code>exports.handler</code></p>
                        <pre style={this.codeStyle()}>{`exports.handler = bst.Logless.capture("` + this.codeSecretKey() + `", function (event, context) {
                                // Lambda code goes here
                            });
                        `}</pre>
                    </Cell>
                </Grid>
                <Grid>
                    <Cell col={12}>
                        {this.props.newSource ? (
                            <Button accent={true} raised={true}><Link style={{color: "white", textDecoration: "none"}} to={"/skills/" + this.props.newSource.slug + "/logs"}>Next: Check for Logs</Link></Button>
                        ) : (undefined)}
                    </Cell>
                </Grid>
            </div>
        );
    }
};



export default connect(
    mapStateToProps,
    mapDispatchToProps
)(NewSourcePage);