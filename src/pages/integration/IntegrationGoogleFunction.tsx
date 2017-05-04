import * as React from "react";

import { Cell, Grid } from "../../components/Grid";
import { CodeSheet, IntegrationSubPage, IntegrationSubPageProps, IntegrationSubPageState } from "./IntegrationSubPage";

interface IntegrationGoogleFunctionProps extends IntegrationSubPageProps {
}

interface IntegrationGoogleFunctionState extends IntegrationSubPageState {
}

export class IntegrationGoogleFunction extends IntegrationSubPage<IntegrationGoogleFunctionProps, IntegrationGoogleFunctionState> {

    render() {
        return (
            <Grid>
                <Cell col={12}>
                    <div>
                        <h4>Integrating Logless into a Google Cloud Function project</h4>
                        <p>Install the dependency</p>
                        <CodeSheet>{
                            `$npm install bespoken-tools --save `
                        }</CodeSheet>
                        <p>Import bst to your index.js</p>
                        <CodeSheet>{
                            `var bst = require('bespoken-tools');`
                        }</CodeSheet>
                        <p> Wrap your <code>exports</code> definition:</p>
                        <CodeSheet>{
                            `// The secret key is provided when you create a new source in the Logless dashboard
exports.function = bst.Logless.capture("<SECRET_KEY>", function (request, response) {
  // Cloud Function code goes here
  response.json({ foo: "bar" });
});`
                        }</CodeSheet>
                    </div>
                </Cell>
            </Grid>
        );
    }
}

export default IntegrationGoogleFunction;
