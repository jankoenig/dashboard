import { Component } from "react";

import { Button } from "react-toolbox/lib/button";
import Input from "react-toolbox/lib/input";

import { Icon, ICON } from "./Icon";

import theme = require("../themes/authform.scss");

export interface AuthFormProps {
    error?: string;
    onSubmit: (email: string, pass: string) => void;
    onLoginWithGithub?: () => void;
    onSignUpWithEmail?: (email: string, pass: string) => void;
    onResetPassword?: (email: string) => void;
}

export interface AuthFormState {
    email: string;
    isConfirmPasswordVisible?: boolean;
}

export default class AuthForm extends Component<AuthFormProps, AuthFormState> {

    constructor(props: AuthFormProps) {
        super(props);
        this.state = {
            email: "",
            isConfirmPasswordVisible: false
        };
    }

    onRegister() {
        this.state.isConfirmPasswordVisible = true;
        this.setState(this.state);
    }

    onEmailChange(email: string) {

    }

    onResetPassword(email: string) {
        if (this.props.onResetPassword) {
            this.props.onResetPassword(email);
        }
    }

    render() {
        return (
            <div className="mdl-card__supporting-text">
                <NormalLoginForm
                    error={this.props.error}
                    onLogin={this.props.onSubmit}
                    onSignUpWithEmail={this.props.onSignUpWithEmail}
                    onEmailChange={this.onEmailChange.bind(this)}
                    onResetPassword={this.onResetPassword.bind(this)}
                    />
                <div className="mdl-card__actions mdl-card--border clearfix">
                    <LoginGithub onLoginWithGithub={this.props.onLoginWithGithub} />
                </div>
            </div>
        );
    }
}

interface PasswordResetProps {
    onPasswordReset: () => void;
}

class PasswordReset extends Component<PasswordResetProps, any> {
    render() {
        return (
            <Button
                label="Reset Password"
                onClick={this.props.onPasswordReset}
                style={{ float: "right", height: "16px", fontSize: "12px", color: "#03A9F4", textTransform: "none", lineHeight: "12px" }} />
        );
    }
}

interface LoginGithubProps {
    onLoginWithGithub?: () => void;
}

class LoginGithub extends Component<LoginGithubProps, any> {
    render() {
        return (
            this.props.onLoginWithGithub ? (
                <div style={{ width: "100%", textAlign: "Center" }}>
                    <Button
                        theme={theme}
                        label="Login with Github"
                        icon={(<Icon style={{ marginRight: "13px" }} width={20} height={20} icon={ICON.GITHUB} />)}
                        onClick={this.props.onLoginWithGithub.bind(this)} />
                </div>
            ) : undefined
        );
    }
}

interface NormalLoginFormProps {
    onEmailChange: (email: string) => void;
    onLogin: (email: string, pass: string) => void;
    onSignUpWithEmail: (email: string, pass: string) => void;
    onResetPassword: (email: string) => void;
    error?: string;
}

interface NormalLoginFormState {
    error?: string;
    email?: string;
    password?: string;
    confirmPass?: string;
    isConfirmPassword?: boolean;
}

class NormalLoginForm extends Component<NormalLoginFormProps, NormalLoginFormState> {

    constructor(props: NormalLoginFormProps) {
        super(props);
        this.state = {
            error: props.error
        };
    }

    componentWillReceiveProps(nextProps: NormalLoginFormProps, ctx: any) {
        this.state.error = nextProps.error;
        this.setState(this.state);
    }

    onEmailChange(value: string) {
        this.state.email = value;
        this.setState(this.state);
    }

    onPasswordChange(value: string) {
        this.state.password = value;
        this.setState(this.state);
    }

    onConfirmPassChange(value: string) {
        console.info("value = " + value);
        this.state.confirmPass = value;
        this.setState(this.state);
    }

    onLogin() {
        console.log(this.state.email);
        console.log(this.state.password);
        this.props.onLogin(this.state.email, this.state.password);
        this.state.password = "";
        this.state.confirmPass = "";
        this.setState(this.state);
    }

    onSignUpClick() {
        this.state.confirmPass = "";
        this.state.isConfirmPassword = true;
        this.setState(this.state);
    }

    onSubmitClicked() {
        if (this.state.password !== this.state.confirmPass) {
            this.state.error = "Passwords do not match.";
        } else {
            this.state.error = "";
            this.props.onSignUpWithEmail(this.state.email, this.state.password);
        }
        this.state.password = "";
        this.state.confirmPass = "";
        this.setState(this.state);
    }

    onPasswordReset() {
        this.props.onResetPassword(this.state.email);
    }

    onFormSubmit() {
        if (this.state.isConfirmPassword) {
            this.onSubmitClicked();
        } else {
            this.onLogin();
        }
    }

    render() {
        let signupBtn = this.state.isConfirmPassword ?
            (
                <Button
                    theme={theme}
                    label="Submit"
                    onClick={this.onSubmitClicked.bind(this)}
                    />
            ) :
            (
                <Button
                    theme={theme}
                    label="Sign Up"
                    onClick={this.onSignUpClick.bind(this)} />
            );

        return (
            <div>
                <LoginForms
                    email={this.state.email}
                    password={this.state.password}
                    confirmPassword={this.state.confirmPass}
                    showConfirmPassword={this.state.isConfirmPassword}
                    error={this.state.error}
                    onEmailChange={this.onEmailChange.bind(this)}
                    onPasswordChange={this.onPasswordChange.bind(this)}
                    onConfirmPasswordChange={this.onConfirmPassChange.bind(this)}
                    onPasswordSubmit={this.onFormSubmit.bind(this)}
                    onConfirmPasswordSubmit={this.onFormSubmit.bind(this)} />
                <div className="mdl-card__actions mdl-card--border clearfix">
                    <Button
                        theme={theme}
                        label="Login"
                        onClick={this.onLogin.bind(this)} />
                    {signupBtn}
                    <PasswordReset
                        onPasswordReset={this.onPasswordReset.bind(this)} />
                </div>
            </div>
        );
    }
}

interface LoginFormsProps {
    email: string;
    password: string;
    confirmPassword: string;
    error: string;
    showConfirmPassword: boolean;
    onEmailChange: (newText: string) => void;
    onPasswordChange: (newText: string) => void;
    onConfirmPasswordChange: (newText: string) => void;
    onPasswordSubmit: () => void;
    onConfirmPasswordSubmit: () => void;
}

interface LoginFormsState {
}

class LoginForms extends Component<LoginFormsProps, LoginFormsState> {

    onEmailChange(value: string) {
        if (this.props.onEmailChange) {
            this.props.onEmailChange(value);
        }
    }

    onPasswordChange(value: string) {
        if (this.props.onEmailChange) {
            this.props.onPasswordChange(value);
        }
    }

    onConfirmPasswordChange(value: string) {
        if (this.props.onEmailChange) {
            this.props.onConfirmPasswordChange(value);
        }
    }

    onPasswordKeyPress(name: string, event: any) {
        if (event.charCode === 13) {
            if (name === "password") {
                this.props.onPasswordSubmit();
            } else if (name === "confirmPassword") {
                this.props.onConfirmPasswordSubmit();
            }
        }
    }

    render() {
        console.log(this.props.confirmPassword);
        return (
            <div>
                <Input
                    theme={theme}
                    label="Email"
                    type="text"
                    value={this.props.email}
                    onChange={this.onEmailChange.bind(this)}
                    />
                <Input
                    theme={theme}
                    label="Password"
                    type="password"
                    value={this.props.password}
                    onChange={this.onPasswordChange.bind(this)}
                    onKeyPress={this.onPasswordKeyPress.bind(this, "password")}
                    />
                {
                    this.props.showConfirmPassword ?
                        (
                            <Input
                                theme={theme}
                                label="Confirm Password"
                                type="password"
                                value={this.props.confirmPassword}
                                onChange={this.onConfirmPasswordChange.bind(this)}
                                onKeyPress={this.onPasswordKeyPress.bind(this, "confirmPassword")}
                                />
                        ) :
                        undefined

                }
                <div style={{ color: "#d50000", marginTop: "5px", marginBottom: "10px" }}>
                    <label>{this.props.error}</label>
                </div>
            </div>
        );
    }
}