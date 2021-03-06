import * as React from "react";

import { Cell, Grid } from "../../components/Grid";
import { CodeSheet, IntegrationSubPage, IntegrationSubPageProps, IntegrationSubPageState } from "./IntegrationSubPage";

interface IntegrationNodeJSLambdaProps extends IntegrationSubPageProps {
}

interface IntegrationNodeJSLambdaState extends IntegrationSubPageState {
}

export class IntegrationNodeJSLambda extends IntegrationSubPage<IntegrationNodeJSLambdaProps, IntegrationNodeJSLambdaState> {

    render() {
        return (
            <Grid>
                <Cell style={{marginTop: 0}} col={12}>
                    <div>
                        <h4 style={{marginTop: 0}}>Integrating Logless into a NodeJS Lambda project</h4>
                        <p>Install the dependency</p>
                        <CodeSheet>{
                            `$npm install bespoken-tools --save `
                        }</CodeSheet>
                        <p>Import bst to your index.js</p>
                        <CodeSheet>{
                            `var bst = require('bespoken-tools');`
                        }</CodeSheet>
                        <p> Wrap your <code>exports.handler</code></p>
                        <CodeSheet>{
                            `exports.handler = bst.Logless.capture("` + this.state.secretText + `", function (event, context) {` +
                            `\n    // Lambda code goes here` +
                            `\n});`
                        }</CodeSheet>
                    </div>
                </Cell>
            </Grid>
        );
    }
}

export default IntegrationNodeJSLambda;
