import * as React from "react";

import { Cell, Grid } from "../components/Grid";

export default class HomePage extends React.Component<any, any> {

    render() {
        return (
            <div>
                <Grid>
                    <Cell col={12}>
                        <h2>Your Skills</h2>
                    </Cell>
                </Grid>

                <Grid>
                    <Cell col={12}>
                        <p> TODO: List your skills </p>
                    </Cell>
                </Grid>
            </div>
        );
    }
};

