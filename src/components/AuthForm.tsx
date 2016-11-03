import * as React from "react";

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
        console.log("register fires");
        this.setState({ isConfirmPasswordVisible: true });
    }

    render() {
        return (
            <div className="mdl-card__supporting-text">
                <form id="auth">
                    <div className="mdl-textfield mdl-js-textfield">
                        <input className="mdl-textfield__input" type="text" id="email" value={this.props.email} onChange={this.props.onChange} />
                        <label className="mdl-textfield__label" for="email">email</label>
                    </div>
                    <div className="mdl-textfield mdl-js-textfield">
                        <input className="mdl-textfield__input" type="password" id="password" value={this.props.password} onChange={this.props.onChange} />
                        <label className="mdl-textfield__label" for="password">password</label>
                    </div>
                    <div className="mdl-textfield mdl-js-textfield" hidden={!this.state.isConfirmPasswordVisible}>
                        <input className="mdl-textfield__input" type="password" id="confirmPassword" value={this.props.confirmPassword} onChange={this.props.onChange} />
                        <label className="mdl-textfield__label" for="confirmPassword">confirm</label>
                    </div>
                    <div className="mdl-label mdl-js-label">
                        <label className="mdl-label" for="error">{this.props.error}</label>
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
            </div>);
    }
}
