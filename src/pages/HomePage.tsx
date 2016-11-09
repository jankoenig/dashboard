import * as React from "react";
import { Link } from "react-router";

import Button from "../components/Button";
import { Cell, Grid } from "../components/Grid";

export default class HomePage extends React.Component<any, any> {

    render() {
        return (
            <div>
                <Grid>
                    <Cell col={12}>
                        <h3>Welcome to the early access preview!</h3>
                    </Cell>
                </Grid>
                <Grid>
                    <Cell col={12}>
                        <p style={{ fontSize: "18px" }}>
                            Hello!
                        <br /><br />
                            We really appreciate you being here and we are excited to release this preview of our latest tool for you to try out.
                        <br /><br />
                            When developing skills for Alexa, we quickly got frustrated with using CloudWatch to access the logs for a skill.  It is not only a challenge to find your logs in CloudWatch but the logs themselves are not easy to comprehend.
                        <br /><br />
                            So, we set out to build better logging for Alexa Skills that has all the best practices baked in and is tailored for the use case. Logging that is:
                            <ul style={{ fontSize: "18px" }}>
                                <li>Thorough, logs not just the console.log statements but also the requests and responses </li>
                                <li>Performant, doesn't get in the way of your skill's user experience and has all the best practices baked in</li>
                                <li>Tailored for Alexa Skills, display your logs in a way that is complementary to the information you are logging</li>
                            </ul>
                            A quick disclaimer, this is a product preview (not even a beta!).  This means things will be updating and changing quickly so we do not recommend you using it in production yet.  It also means you will have significant influence on what features we implement next so we want to hear from you.
                        <br /><br />
                            Feel free to <a href="mailto:michael@bespoken.tools">email me</a> directly with any thoughts and comments you may have or you can <a href="https://github.com/bespoken/dashboard/issues/new?labels=feature%20request&body=">submit a feature request</a> or <a href="https://github.com/bespoken/dashboard/issues/new?labels=bug">file a bug</a> through our issue tracker.
                        <br /><br />
                            Thanks,
                        <br /><br />
                            Michael & the <a href="https://github.com/bespoken"> Bespoken Tools Team</a>
                            <br /><br />
                        </p>
                    </Cell>
                    <Cell col={12}>
                        <Button accent={true} raised={true}>
                            <Link style={{ color: "white", textDecoration: "none" }} to={"/skills/new"}>Let's Get Started!</Link>
                        </Button>
                    </Cell>
                </Grid>
            </div>
        );
    }
};

