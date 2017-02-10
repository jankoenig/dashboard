import * as React from "react";

import { Cell, Grid } from "../../components/Grid";

interface IntegrationJavaProps {
    secretKey?: string;
}

interface IntegrationJavaState {

}

export class IntegrationJava extends React.Component<IntegrationJavaProps, IntegrationJavaState> {

    static codeStyle: React.CSSProperties = {
            margin: "10px",
            padding: "20px",
            backgroundColor: "#CFD8DC",
            color: "#263238",
            whiteSpace: "pre-line"
    };

    render() {
        return (
            <Grid>
                <Cell col={12}>
                    <h4>Integrate the SDK</h4>
                    <p>Install the dependency</p>
                    <pre style={IntegrationJava.codeStyle}>{`$npm install bespoken-tools --save `}</pre>
                    <p>Import bst to your index.js</p>
                    <pre style={IntegrationJava.codeStyle}>{`var bst = require('bespoken-tools');`}</pre>
                    <p> Wrap your <code>exports.handler</code></p>
                    <pre style={IntegrationJava.codeStyle}>{`exports.handler = bst.Logless.capture("` + this.props.secretKey + `", function (event, context) {
                                // Lambda code goes here
                            });
                        `}</pre>
                </Cell>
            </Grid>
        );
    }
}

export default IntegrationJava;

