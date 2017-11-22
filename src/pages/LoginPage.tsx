import * as React from "react";
import { connect } from "react-redux";


import { login, loginWithGithub, resetPassword, signUpWithEmail, SuccessCallback } from "../actions/session";
import { addToast } from "../actions/toast";
import AuthForm from "../components/AuthForm";
import Card from "../components/Card";
import { Cell, Grid } from "../components/Grid";
import User from "../models/user";
import { State } from "../reducers";
import { remoteservice } from "../services/remote-service";

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
    login: (email: string, password: string, redirectStrat?: SuccessCallback) => Promise<User>;
    loginWithGithub: (redirectStrat?: SuccessCallback) => Promise<User>;
    signUpWithEmail: (email: string, password: string, confirmPassword: string, redirectStrat?: SuccessCallback) => Promise<User>;
    resetPassword: (email: string) => Promise<void>;
    addToast: (options: any) => any;
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
        login: async function (email: string, password: string, redirectStrat?: SuccessCallback): Promise<User> {
            return dispatch(login(email, password, redirectStrat));
        },
        signUpWithEmail: async function (email: string, password: string, confirmPassword: string, redirectStrat?: SuccessCallback): Promise<User> {
            return dispatch(signUpWithEmail(email, password, confirmPassword, redirectStrat));;
        },
        loginWithGithub: function (redirectStrat?: SuccessCallback): Promise<User> {
            return dispatch(loginWithGithub(redirectStrat));
        },
        resetPassword: function (email: string): Promise<void> {
            return dispatch(resetPassword(email));
        },
        addToast: function (options: any) {
            return dispatch(addToast(options));
        }
    };
}

export class LoginPage extends React.Component<LoginPageProps, LoginPageState> {

    constructor(props: LoginPageProps) {
        super(props);

        this.handleFormLoginWithGithub = this.handleFormLoginWithGithub.bind(this);
        this.handleFormSignUpWithEmail = this.handleFormSignUpWithEmail.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.handleResetPassword = this.handleResetPassword.bind(this);

        this.state = {};
    }

    handleResetPassword(email: string) {
        this.props.resetPassword(email);
        // Show some feedback in the link
    }

    async handleFormSubmit(email: string, pass: string) {
        try {
            const user = await this.props.login(email, pass);
            if (!user.showToast) return;
            const handleVerifyEmailClick = () => {
                remoteservice.defaultService().auth().currentUser.sendEmailVerification();
                this.props.addToast({ style: { marginTop: 72 }, message: "Verification email sent!", type: "info", duration: 10000 });
            };
            this.props.addToast({ style: { marginTop: 72 }, actionType: "showVerifyToast", message: "Your email is not yet verified - please click on the link in the email we sent to you at signup. If you didn’t receive it, click in this message to get another one.", type: "warning", duration: 10000, onToastClick: handleVerifyEmailClick });
        } catch (err) {
            this.state.error = err.message;
            this.setState(this.state);
        }
    }

    handleFormLoginWithGithub() {
        this.props.loginWithGithub()
            .catch((err: Error) => {
                this.state.error = err.message;
                this.setState(this.state);
            });
    }

    async handleFormSignUpWithEmail(email: string, pass: string, confirmPass: string) {
        try {
            await this.props.signUpWithEmail(email, pass, confirmPass);
            this.props.addToast({ style: { marginTop: 72 }, message: "Verification email sent!", type: "info", duration: 10000 });
        } catch (err) {
            this.state.error = err.message;
            this.setState(this.state);
        }
    }

    render() {
        return (
            <Grid style={{ marginTop: "10%" }}>
                <Cell col={4} tablet={2} hidePhone={true} />
                <Cell col={4} tablet={4} phone={4} align={"middle"} style={{ display: "flex", justifyContent: "center" }}>
                    <Card style={{ overflow: "visible" }}>
                        <AuthForm
                            error={this.state.error}
                            onSubmit={this.handleFormSubmit}
                            onLoginWithGithub={this.handleFormLoginWithGithub}
                            onSignUpWithEmail={this.handleFormSignUpWithEmail}
                            onResetPassword={this.handleResetPassword}
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

