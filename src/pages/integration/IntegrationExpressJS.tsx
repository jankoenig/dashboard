import * as React from "react";

import { Cell, Grid } from "../../components/Grid";

interface IntegrationNodeJsProps {
    secretKey?: string;
}

interface IntegrationNodeJsState {

}

export class IntegrationNodeJs extends React.Component<IntegrationNodeJsProps, IntegrationNodeJsState> {

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
                    <div>
                        <h4>Integrating Logless in to an ExpressJS project</h4>
                        <p>Install the dependency</p>
                        <pre style={IntegrationNodeJs.codeStyle}>{`$npm install bespoken-tools --save `}</pre>
                        <p> Configure it with your current routes. </p>
                        <pre style={IntegrationNodeJs.codeStyle}>{
                            `var bst = require('bespoken-tools')

                            var logless = bst.Logless.middleware("` + this.props.secretKey  + `");
                            app = express();

                            app.use(bodyParser.json());
                            app.use(logless.requestHandler);

                            // Application handlers and routers registered here
                            app.post("/", function {
                                ...
                            });

                            // The Logless error handler must be registered last
                            app.use(logless.errorHandler);
                            `
                        }
                        </pre>
                    </div>
                </Cell>
            </Grid>
        );
    }
}

export default IntegrationNodeJs;