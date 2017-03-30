import * as React from "react";
import { connect } from "react-redux";

import { Cell, Grid } from "../../components/Grid";
import User from "../../models/user";
import { State } from "../../reducers";
import UserBetaFeatures from "./UserBetaFeatures";

interface UserSettingsPageProps {
    user: User;
    goTo: (path: string) => (dispatch: Redux.Dispatch<any>) => void;
}

interface UserSettingsPageState { };

function mapStateToProps(state: State.All) {
    return {
        user: state.session.user
    };
}

function mapDispatchToProps(dispatch: Redux.Dispatch<any>) {
    return {
    };
}

export class UserSettingsPage extends React.Component<UserSettingsPageProps, UserSettingsPageState> {

    render() {
        return (
            <section>
            <Grid>
                {}
                <Cell>
                    <p>Hello {this.props.user.displayName}!</p>
                </Cell>
            </Grid>
            <Grid>
                <Cell>
                    <UserBetaFeatures />
                </Cell>
            </Grid>
            </section>
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(UserSettingsPage);