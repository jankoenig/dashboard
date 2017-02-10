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
                    <h4>Integrating the SDK in to a Java project</h4>
                    <p>To use with Speechlet: </p>
                    <pre style={IntegrationJava.codeStyle}>{
                        `Logless.capture("` + this.props.secretKey + `", new HelloWorldSpeechlet());`
                    }
                    </pre>
                    <p>To use as a standalone servlet: </p>
                    <pre style={IntegrationJava.codeStyle}>{
                        `Servlet wrapper = Logless.capture("` + this.props.secretKey + `", new HelloWorldServlet());`
                    }
                    </pre>
                    <p>Alternatively, you can wrap Servlet endpoints for greater flexibility: </p>
                    <pre style={IntegrationJava.codeStyle}>{
                        `Logless.capture("` + this.props.secretKey + `", request, response, new IServletHandler() {
                            public void call() throws IOException, ServletException {
                                // Main body of servlet processing
                            }
                        });`
                        }
                    </pre>
                </Cell>
            </Grid>
        );
    }
}

export default IntegrationJava;

