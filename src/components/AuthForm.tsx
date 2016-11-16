import * as React from "react";

import FormInput from "./FormInput";
import { Icon, ICON } from "./Icon";

export interface AuthFormProps {
    email?: string;
    password?: string;
    confirmPassword?: string;
    error?: string;
    onChange?: (event: React.FormEvent) => any;
    onSubmit: (event: React.FormEvent) => void;
    onLoginWithGithub?: (event: React.FormEvent) => void;
    onSignUpWithEmail?: (event: React.FormEvent) => void;
    onForgetPassword?: (event: React.FormEvent) => void;
}

export interface AuthFormState {
    isConfirmPasswordVisible?: boolean;
}

export default class AuthForm extends React.Component<AuthFormProps, AuthFormState> {

    constructor(props: AuthFormProps) {
        super(props);
        this.state = { isConfirmPasswordVisible: false};
    }

    onRegister() {
        this.setState({ isConfirmPasswordVisible: true });
    }

    render() {
        return (
            <div className="mdl-card__supporting-text">
                <form id="auth">
                    </div>
                </form>
                <div className="mdl-card__actions mdl-card--border clearfix">
                    {/* I could not get the <form onSubmit> to work, had to use onClick */}
                    <button
                        className="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect mdl-pull-left"
                        onClick={this.props.onSubmit}>
                        Login
                    </button>
                    {!this.state.isConfirmPasswordVisible ? (
                        <button
                            className="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect mdl-pull-right"
                            onClick={this.onRegister.bind(this)}>
                            Sign Up
                    </button>) : undefined}
                    {this.state.isConfirmPasswordVisible ? (
                        <button
                            className="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect mdl-pull-right"
                            onClick={this.props.onSignUpWithEmail}>
                            Submit
                    </button>) : undefined}
                </div>
                <div className="mdl-card__actions clearfix">
                    <button
                    onClick={this.props.onForgetPassword}
                    className="mdl-button mdl-js-button mdl-js-ripple-effect"
                    style={{height: "16px", fontSize: "12px", color: "#03A9F4", textTransform: "none", lineHeight: "12px"}}>
                        Reset Password
                    </button>
                </div>
                {this.props.onLoginWithGithub ? (
                    <div className="mdl-card__actions mdl-card--border">
                        <button
                            className="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect"
                            onClick={this.props.onLoginWithGithub}>
                            <Icon style={{ marginRight: "13px" }} width={20} height={20} icon={ICON.GITHUB} />
                            Login with Github
                        </button>
                    </div>
                ) : undefined}
            </div>
    }
}
