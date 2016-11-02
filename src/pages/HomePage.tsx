import * as React from "react";
import {Link} from "react-router";

import { Cell, Grid } from "../components/Grid";

export default class HomePage extends React.Component<any, any> {

    render() {
        return (
            <div>
                <Grid>
                    <Cell col={12}>
                        <h3>Welcome to our early access preview!</h3>
                        <p> It looks like you were able to signup and login so we know that part works!</p>
                    </Cell>
                </Grid>

                <Grid>
                    <Cell col={12}>
                        <p>Welcome!</p>
                        <p> We really appreciate you being here.  Our first tool, <a href="https://bespoken.tools/blog/2016/08/24/introducing-bst-proxy-for-alexa-skill-development">bst proxy</a>, helps you develop your Alexa Skills faster by allowing Alexa to communicate directly with the code you are developing on your machine.  This eliminated the need to redeploy your Lambda after every change.
                         </p>

                        <p>One of the most useful features of the proxy was the ability to see the actual payloads coming from Alexa and also see your console.log statements in your command line.  As a natural extension of the proxy tool, we are now building a new logging tool that will allow you to view your logs from either your development or production environments</p>

                        <p> A quick disclaimer, this is a product preview (not even a beta!).  This means things will be updating and changing quickly so we do not recommend you using it in production yet.  It also means you will have <span> significant</span> influence on what features we implement next. </p>

                        <p>Thanks,</p>
                        <p>The Bespoken Tools Team</p>
                    </Cell>
                    <Cell col={12}>
                        <p><Link to={"/skills/new"}>P.S. Start here! Time to setup a Skill!</Link></p>
                    </Cell>
                </Grid>
            </div>
        );
    }
};

