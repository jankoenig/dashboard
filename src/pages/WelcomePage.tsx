import * as React from "react";

import { Cell, Grid } from "../components/Grid";

export default class WelcomePage extends React.Component<any, any> {
    render() {
        return (
            <Grid>
                <Cell col={12}>
                    <h3>Welcome!</h3>
                </Cell>
                <Cell col={12}>
                    <h5>News</h5>
                    <ul>
                        <li><a target="_blank" href="https://bespoken.tools/blog/2016/09/28/developing-locally-with-bst">Developing Locally with BST</a></li>
                        <li><a target="_blank" href="https://bespoken.tools/blog/2016/11/02/lambda-deploy-and-more">One Step Lambda Deploy</a></li>
                        <li><a target="_blank" href="https://bespoken.tools/blog/2016/10/10/unit-testing-alexa-skills">Unit Testing Alexa Skills</a></li>
                    </ul>
                </Cell>
                <Cell col={12}>
                    <h5>Docs</h5>
                    <ul>
                        <li><a target="_blank" href="http://docs.bespoken.tools/en/latest/api/classes/logless.html">Setup your Lambda or Cloud Function for Logless</a></li>
                        <li><a target="_blank" href="http://docs.bespoken.tools/en/latest/tutorials/tutorial_lambda_local/">[Tutorial] Running Lambdas Locally</a></li>
                    </ul>
                </Cell>
                <Cell col={12}>
                    <h5>Get In Touch </h5>
                    <ul>
                        <li><a target="_blank" href="https://github.com/bespoken/dashboard/issues/new?labels=bug">Report an Issue</a></li>
                        <li><a target="_blank" href="https://github.com/bespoken/dashboard/issues/new?labels=feature%20request&body=">Request a Feature</a></li>
                        <li><a target="_blank" href="https://gitter.im/bespoken/bst?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge">Chat on Gitter</a></li>
                    </ul>
                </Cell>
            </Grid>
        );
    }
};

