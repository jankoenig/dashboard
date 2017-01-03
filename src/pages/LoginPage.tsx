
import * as React from "react";
import { connect } from "react-redux";

import { login, loginWithGithub, resetPassword, signUpWithEmail, SuccessCallback, ToPathCallback } from "../actions/session";
import { Cell, Grid } from "../components/Grid";

import AuthForm from "../components/AuthForm";
import Card from "../components/Card";

/**
 * Configuration objects to pass in to the router when pushing or replacing this page on the router.
 */
export interface LoginConfig {
    /**
     * The next path to go to once logged in.
     */
    nextPathName?: string;
}

interface LoginPageProps {
    error: string;
    login: (email: string, password: string, redirectStrat: SuccessCallback) => (dispatch: Redux.Dispatch<any>) => void;
    loginWithGithub: (redirectStrat: SuccessCallback) => (dispatch: Redux.Dispatch<any>) => void;
    signUpWithEmail: (email: string, password: string, confirmPassword: string, redirectStrat: SuccessCallback) => (dispatch: Redux.Dispatch<any>) => void;
    resetPassword: (email: string) => (dispatch: Redux.Dispatch<void>) => void;
    location?: RoutingData.Location<LoginConfig>;
};

function mapDispatchToProps(dispatch: Redux.Dispatch<any>) {
    return {
        login: function (email: string, password: string, redirectStrat: SuccessCallback) {
            return dispatch(login(email, password, redirectStrat));
        },
        signUpWithEmail: function (email: string, password: string, confirmPassword: string, redirectStrat: SuccessCallback) {
            return dispatch(signUpWithEmail(email, password, confirmPassword, redirectStrat));
        },
        loginWithGithub: function (redirectStrat: SuccessCallback) {
            return dispatch(loginWithGithub(redirectStrat));
        },
        resetPassword: function (email: string) {
            return dispatch(resetPassword(email));
        }
    };
}

export class LoginPage extends React.Component<LoginPageProps, any> {

    handleResetPassword(email: string) {
        this.props.resetPassword(email);
        // Show some feedback in the link
    }

    handleFormSubmit(email: string, pass: string) {
        this.props.login(email, pass, this.getRedirectStrategy());
    }

    handleFormLoginWithGithub() {
        this.props.loginWithGithub(this.getRedirectStrategy());
    }

    handleFormSignUpWithEmail(email: string, pass: string, confirmPass: string) {
        this.props.signUpWithEmail(email, pass, confirmPass, this.getRedirectStrategy());
    }

    getRedirectStrategy(): SuccessCallback {
        if (!this.props.location || !this.props.location.state || !this.props.location.state.nextPathName) {
            return undefined;
        } else {
            return new ToPathCallback(this.props.location.state.nextPathName);
        }
    }

    render() {
        return (
            <Grid>
                <Cell col={4} tablet={2} hidePhone={true} />
                <Cell col={4} tablet={4} phone={4} align={"middle"}>
                    <Card>
                        <AuthForm
                            error={this.props.error}
                            onSubmit={this.handleFormSubmit.bind(this)}
                            onLoginWithGithub={this.handleFormLoginWithGithub.bind(this)}
                            onSignUpWithEmail={this.handleFormSignUpWithEmail.bind(this)}
                            onResetPassword={this.handleResetPassword.bind(this)}
                            />
                    </Card>
                </Cell>
                <Cell col={4} tablet={2} hidePhone={true} />
            </Grid>
        );
    }
};

export default connect(
    mapDispatchToProps
)(LoginPage);
