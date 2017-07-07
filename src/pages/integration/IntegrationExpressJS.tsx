import * as React from "react";

import { Cell, Grid } from "../../components/Grid";
import { CodeSheet, IntegrationSubPage, IntegrationSubPageProps, IntegrationSubPageState } from "./IntegrationSubPage";

interface IntegrationNodeJsProps extends IntegrationSubPageProps {
}

interface IntegrationNodeJsState extends IntegrationSubPageState {
}

export class IntegrationNodeJs extends IntegrationSubPage<IntegrationNodeJsProps, IntegrationNodeJsState> {
    render() {
        return (
            <Grid>
                <Cell style={{marginTop: 0}} col={12}>
                    <div>
                        <h4 style={{marginTop: 0}}>Integrating Logless in to an ExpressJS project</h4>
                        <p>Install the dependency</p>
                        <CodeSheet>{
                            `$npm install bespoken-tools --save`
                            }</CodeSheet>
                        <p> Configure it with your current routes. </p>
                        <CodeSheet>{
                            `var bst = require('bespoken-tools')` +
                            `\n` +
                            `\nvar logless = bst.Logless.middleware("` + this.state.secretText + `");` +
                            `\napp = express();` +
                            `\n` +
                            `\n// Make sure to place bodyParser.json() before the logless.requestHandler` +
                            `\napp.use(bodyParser.json());` +
                            `\napp.use(logless.requestHandler);` +
                            `\n` +
                            `\n// Application handlers and routers registered here` +
                            `\napp.post("/", function() {` +
                            `\n    ...` +
                            `\n});` +
                            `\n` +
                            `\n// The Logless error handler must be registered last` +
                            `\napp.use(logless.errorHandler);`
                        }</CodeSheet>
                    </div>
                </Cell>
            </Grid>
        );
    }
}

export default IntegrationNodeJs;
