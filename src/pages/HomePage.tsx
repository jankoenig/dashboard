import * as React from "react";

import { Cell, Grid } from "../components/Grid";

export default class HomePage extends React.Component<any, any> {
    render() {
        return (
            <Grid>
                <Cell col={12}>
                    <h3>Welcome!</h3>
                </Cell>
            </Grid>
        );
    }
};

