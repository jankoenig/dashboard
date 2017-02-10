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
                <Cell col={12}>
                    <div>
                        <h4>Integrating Logless in to an ExpressJS project</h4>
                        <p>Install the dependency</p>
                        <CodeSheet> {
                            `$npm install bespoken-tools --save`
                            }
                        </CodeSheet>
                        <p> Configure it with your current routes. </p>
                        <CodeSheet> {
                            `var bst = require('bespoken-tools')

                            var logless = bst.Logless.middleware("` + this.state.secretText + `");
                            app = express();

                            app.use(bodyParser.json());
                            app.use(logless.requestHandler);

                            // Application handlers and routers registered here
                            app.post("/", function {
                                ...
                            });

                            // The Logless error handler must be registered last
                            app.use(logless.errorHandler);`
                        }
                        </CodeSheet>
                    </div>
                </Cell>
            </Grid>
        );
    }
}

export default IntegrationNodeJs;