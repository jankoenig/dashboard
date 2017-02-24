import * as React from "react";
import { connect } from "react-redux";

import { Cell, Grid } from "../components/Grid";
import { State } from "../reducers";

interface SettingsPageProps {

}

interface SettingsPageState {

}

function mapStateToProps(state: State.All) {
    return {
    };
}

function mapDispatchToProps(dispatch: Redux.Dispatch<any>) {
    return {

    };
}

export class SettingsPage extends React.Component<SettingsPageProps, SettingsPageState> {

    render() {
        return (
            <Grid>
                <Cell>
                    <p>Future home of the settings page.</p>
                </Cell>
            </Grid>
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SettingsPage);