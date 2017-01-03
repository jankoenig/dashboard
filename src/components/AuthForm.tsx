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
        this.state.email = email;
        this.setState(this.state);
    }

    onPasswordReset(event: React.FormEvent) {
        if (this.props.onResetPassword) {
            this.props.onResetPassword(this.state.email);
        }
    }

    render() {
        return (
            <div className="mdl-card__supporting-text">
                <LoginGithub onLoginWithGithub={this.props.onLoginWithGithub} />
                <NormalLoginForm
                    onLogin={this.props.onSubmit}
                    onSignUpWithEmail={this.props.onSignUpWithEmail}
                    onEmailChange={this.onEmailChange.bind(this)}
                    />
                <div className="mdl-card__actions clearfix">
                    <button
                        onClick={this.onPasswordReset.bind(this)}
                        className="mdl-button mdl-js-button mdl-js-ripple-effect"
                        style={{ float: "right", height: "16px", fontSize: "12px", color: "#03A9F4", textTransform: "none", lineHeight: "12px" }}>
                        Reset Password
                    </button>
                </div>
            </div>
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
    error?: string;
}

interface NormalLoginFormState {
    email?: string;
    password?: string;
    confirmPass?: string;
    isConfirmPassword?: boolean;
}

class NormalLoginForm extends Component<NormalLoginFormProps, NormalLoginFormState> {

    constructor(props: NormalLoginFormProps) {
        super(props);
        this.state = {};
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
        this.state.confirmPass = value;
        this.setState(this.state);
    }

    onLogin(event: React.FormEvent) {
        this.props.onLogin(this.state.email, this.state.password);
        this.state.password = "";
        this.state.confirmPass = "";
        this.setState(this.state);
    }

    onSignUpClick(event: React.FormEvent) {
        this.state.confirmPass = "";
        this.state.isConfirmPassword = true;
        this.setState(this.state);
    }

    onSubmitClicked(event: React.FormEvent) {
        if (this.state.password !== this.state.confirmPass) {
            this.props.error = "Passwords do not match.";
        } else {
            this.props.error = "";
            this.props.onSignUpWithEmail(this.state.email, this.state.password);
        }
        this.state.password = "";
        this.state.confirmPass = "";
        this.setState(this.state);
    }

    render() {
        let signupBtn = this.state.isConfirmPassword ?
            (
                <Button
                    theme={theme}
                    label="Submit"
                    onClick={this.props.onSignUpWithEmail.bind(this)}
                    />
            ) :
            (
                <Button
                    theme={theme}
                    label="Sign Up"
                    onClick={this.onSignUpClick.bind(this)} />
            );

        return (
            <div style={{ margin: "16px" }}>
                <LoginForms
                    onEmailChange={this.onEmailChange.bind(this)}
                    onPasswordChange={this.onPasswordChange.bind(this)}
                    onConfirmPasswordChange={this.onConfirmPassChange.bind(this)}
                    showConfirmPassword={this.state.isConfirmPassword} />
                <div className="mdl-card__actions mdl-card--border clearfix">
                    <Button
                        theme={theme}
                        label="Login"
                        onClick={this.props.onSignUpWithEmail.bind(this)} />
                    {signupBtn}
                </div>
            </div>
        );
    }
}

interface LoginFormsProps {
    email?: string;
    password?: string;
    confirmPassword?: string;
    error?: string;
    showConfirmPassword?: boolean;
    onEmailChange?: (newText: string) => void;
    onPasswordChange?: (newText: string) => void;
    onConfirmPasswordChange?: (newText: string) => void;
}

interface LoginFormsState {
}

class LoginForms extends Component<LoginFormsProps, LoginFormsState> {

    onEmailChange(event: React.FormEvent) {
        preventDefaults(event);
        if (this.props.onEmailChange) {
            let target = event.target as HTMLSelectElement;
            this.props.onEmailChange(target.value);
        }
    }

    onPasswordChange(event: React.FormEvent) {
        preventDefaults(event);
        if (this.props.onEmailChange) {
            let target = event.target as HTMLSelectElement;
            this.props.onPasswordChange(target.value);
        }
    }

    onConfirmPasswordChange(event: React.FormEvent) {
        preventDefaults(event);
        if (this.props.onEmailChange) {
            let target = event.target as HTMLSelectElement;
            this.props.onConfirmPasswordChange(target.value);
        }
    }

    render() {
        return (
            <div>
                <Input
                    label="Email"
                    type="text"
                    value={this.props.email}
                    onChange={this.onEmailChange.bind(this)}
                    />
                <Input
                    label="Password"
                    type="password"
                    value={this.props.password}
                    onChange={this.onPasswordChange.bind(this)}
                    />
                {
                    this.props.showConfirmPassword ?
                        (
                            <Input
                                label="Confirm Password"
                                type="password"
                                value={this.props.confirmPassword}
                                onChange={this.onConfirmPasswordChange.bind(this)}
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

function preventDefaults(event: React.FormEvent) {
    event.preventDefault();
}