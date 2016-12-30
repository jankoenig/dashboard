import * as React from "react";

import { Button } from 'react-toolbox/lib/button';

import FormInput from "./FormInput";
import { Icon, ICON } from "./Icon";

import theme = require("../themes/authform.scss");

export interface AuthFormProps {
    email?: string;
    password?: string;
    confirmPassword?: string;
    error?: string;
    onChange?: (event: React.FormEvent) => any;
    onSubmit: (event: React.FormEvent) => void;
    onLoginWithGithub?: (event: React.FormEvent) => void;
    onSignUpWithEmail?: (event: React.FormEvent) => void;
    onResetPassword?: (event: React.FormEvent) => void;
}

export interface AuthFormState {
    isConfirmPasswordVisible?: boolean;
}

export default class AuthForm extends React.Component<AuthFormProps, AuthFormState> {

    constructor(props: AuthFormProps) {
        super(props);
        this.state = { isConfirmPasswordVisible: false };
    }

    onRegister() {
        this.setState({ isConfirmPasswordVisible: true });
    }

    render() {
        return (
            <div className="mdl-card__supporting-text">
                    {this.props.onLoginWithGithub ? (
                    <div style={{ width: "100%", textAlign: "Center" }}>
                        <Button
                            theme={theme}
                            label="Login with Github"
                            icon={(<Icon style={{ marginRight: "13px" }} width={20} height={20} icon={ICON.GITHUB} />)}
                            onClick={this.props.onLoginWithGithub.bind(this)} />
                    </div>
                    ) : undefined}
                <div style={{ marginTop: "16px" }} className="mdl-card__actions mdl-card--border clearfix">
                    <form id="auth" onSubmit={this.props.onSubmit} >
                        <FormInput
                            label={"Email"}
                            type={"text"}
                            floatingLabel={true}
                            value={this.props.email}
                            onChange={this.props.onChange} />
                        <FormInput
                            label={"Password"}
                            type={"password"}
                            floatingLabel={true}
                            value={this.props.password}
                            onChange={this.props.onChange} />
                        <FormInput
                            label={"Confirm Password"}
                            type={"password"}
                            floatingLabel={true}
                            value={this.props.confirmPassword}
                            onChange={this.props.onChange}
                            hidden={!this.state.isConfirmPasswordVisible} />
                        <div style={{ color: "#d50000", marginTop: "5px", marginBottom: "10px" }}>
                            <label>{this.props.error}</label>
                        </div>
                    </form>
                    <Button
                        theme={theme}
                        label="Login"
                        onClick={this.props.onSignUpWithEmail.bind(this)} />
                    {!this.state.isConfirmPasswordVisible ? (
                        <Button
                            theme={theme}
                            label="Sign Up"
                            onClick={this.props.onSignUpWithEmail.bind(this)} />
                    ) : undefined}
                    {this.state.isConfirmPasswordVisible ? (
                        <Button
                            theme={theme}
                            label="Submit"
                            onClick={this.props.onSignUpWithEmail.bind(this)} />
                    ) : undefined}
                </div>
                <div className="mdl-card__actions clearfix">
                    <button
                        onClick={this.props.onResetPassword}
                        className="mdl-button mdl-js-button mdl-js-ripple-effect"
                        style={{ float: "right", height: "16px", fontSize: "12px", color: "#03A9F4", textTransform: "none", lineHeight: "12px" }}>
                        Reset Password
                    </button>
                </div>
            </div>
        );
    }
}
