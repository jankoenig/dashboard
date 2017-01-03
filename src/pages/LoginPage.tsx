
import * as React from "react";
import { connect } from "react-redux";


import { login, loginWithGithub, resetPassword, signUpWithEmail, SuccessCallback, ToPathCallback } from "../actions/session";
import AuthForm from "../components/AuthForm";
import Card from "../components/Card";
import { Cell, Grid } from "../components/Grid";
import User from "../models/user";
import { State } from "../reducers";

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
    login: (email: string, password: string, redirectStrat: SuccessCallback) => Promise<User>;
    loginWithGithub: (redirectStrat: SuccessCallback) => Promise<User>;
    signUpWithEmail: (email: string, password: string, confirmPassword: string, redirectStrat: SuccessCallback) => Promise<User>;
    resetPassword: (email: string) => Promise<void>;
    location?: RoutingData.Location<LoginConfig>;
};

interface LoginPageState {
    error?: string;
}

function mapStateToProps(state: State.All) {
    return {
    };
}

function mapDispatchToProps(dispatch: Redux.Dispatch<any>) {
    return {
        login: function (email: string, password: string, redirectStrat: SuccessCallback): Promise<User> {
            return dispatch(login(email, password, redirectStrat));
        },
        signUpWithEmail: function (email: string, password: string, confirmPassword: string, redirectStrat: SuccessCallback): Promise<User> {
            return dispatch(signUpWithEmail(email, password, confirmPassword, redirectStrat));
        },
        loginWithGithub: function (redirectStrat: SuccessCallback): Promise<User> {
            return dispatch(loginWithGithub(redirectStrat));
        },
        resetPassword: function (email: string): Promise<void> {
            return dispatch(resetPassword(email));
        }
    };
}

export class LoginPage extends React.Component<LoginPageProps, LoginPageState> {

    constructor(props: LoginPageProps) {
        super(props);
        this.state = {};
    }

    handleResetPassword(email: string) {
        this.props.resetPassword(email);
        // Show some feedback in the link
    }

    handleFormSubmit(email: string, pass: string) {
        console.info("Logging in with " + email + " " + pass);
        this.props.login(email, pass, this.getRedirectStrategy())
            .catch((err: Error) => {
                console.info("ERROR " + err.message);
                this.state.error = err.message;
                this.setState(this.state);
            });
    }

    handleFormLoginWithGithub() {
        this.props.loginWithGithub(this.getRedirectStrategy())
            .catch((err: Error) => {
                console.info("ERROR " + err.message);
                this.state.error = err.message;
                this.setState(this.state);
            });
    }

    handleFormSignUpWithEmail(email: string, pass: string, confirmPass: string) {
        this.props.signUpWithEmail(email, pass, confirmPass, this.getRedirectStrategy())
            .catch((err: Error) => {
                console.info("ERROR " + err.message);
                this.state.error = err.message;
                this.setState(this.state);
            });
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
                            error={this.state.error}
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
    mapStateToProps,
    mapDispatchToProps
)(LoginPage);
