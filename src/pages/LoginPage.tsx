
import * as React from "react";

import Card from "../components/Card";
import { Grid, Cell } from "../components/Grid";
import AuthForm from "../components/AuthForm";

export default class LoginPage extends React.Component<any, any> {

    render() {
        return (
            <Grid>
                <Cell col={4} />
                <Cell col={4} align={ "middle" }>
                    <Card>
                        <AuthForm />
                    </Card>
                </Cell>
                <Cell col={4} />
            </Grid>
        );
    }
};
