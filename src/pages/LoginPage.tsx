
import * as React from "react";
import { connect } from "react-redux";

import { authFormChanged } from "../actions/auth-form";
import { login, loginWithGithub, resetPassword, signUpWithEmail, SuccessCallback, ToPathCallback } from "../actions/session";
import { Cell, Grid } from "../components/Grid";
import { State } from "../reducers";

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
    email: string;
    password: string;
    confirmPassword: string;
    error: string;
    changeForm: (field: string, value: string) => void;
    login: (email: string, password: string, redirectStrat: SuccessCallback) => (dispatch: Redux.Dispatch<any>) => void;
    loginWithGithub: (redirectStrat: SuccessCallback) => (dispatch: Redux.Dispatch<any>) => void;
    signUpWithEmail: (email: string, password: string, confirmPassword: string, redirectStrat: SuccessCallback) => (dispatch: Redux.Dispatch<any>) => void;
    resetPassword: (email: string) => (dispatch: Redux.Dispatch<void>) => void;
    location?: RoutingData.Location<LoginConfig>;
};

function mapStateToProps(state: State.All) {
    return {
        email: state.authForm.email,
        password: state.authForm.password,
        confirmPassword: state.authForm.confirmPassword,
        error: state.authForm.error
    };
}

function mapDispatchToProps(dispatch: Redux.Dispatch<any>) {
    return {
        changeForm: function (field: string, value: string) {
            dispatch(authFormChanged(field, value));
        },
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

    handleFormChanged(event: React.FormEvent) {
        // Need to cast in order to get to id and value
        // See http://stackoverflow.com/a/39214607/1349766
        let target = event.target as HTMLSelectElement;
        this.props.changeForm(target.id, target.value);
    }

    handleResetPassword(event: React.FormEvent) {
        event.preventDefault();
        this.props.resetPassword(this.props.email);
        // Show some feedback in the link
    }

    handleFormSubmit(event: React.FormEvent) {
        event.preventDefault();
        this.props.login(this.props.email, this.props.password, this.getRedirectStrategy());
    }

    handleFormLoginWithGithub(event: React.FormEvent) {
        event.preventDefault();
        this.props.loginWithGithub(this.getRedirectStrategy());
    }

    handleFormSignUpWithEmail(event: React.FormEvent) {
        event.preventDefault();
        this.props.signUpWithEmail(this.props.email, this.props.password, this.props.confirmPassword, this.getRedirectStrategy());
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
                            email={this.props.email}
                            password={this.props.password}
                            confirmPassword={this.props.confirmPassword}
                            error={this.props.error}
                            onSubmit={this.handleFormSubmit.bind(this)}
                            onChange={this.handleFormChanged.bind(this)}
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
    mapStateToProps,
    mapDispatchToProps
)(LoginPage);
