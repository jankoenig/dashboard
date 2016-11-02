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
    displayErrorMessage?: boolean;
}

export default class AuthForm extends React.Component<AuthFormProps, AuthFormState> {


    constructor(props: AuthFormProps) {
        super(props);
        this.state = { isConfirmPasswordVisible: false, displayErrorMessage: false };
    }

    onRegister() {
        this.setState({ isConfirmPasswordVisible: true });
    }

    comparePass() {
        if (this.props.password === this.props.confirmPassword) {
            if (this.props.password.length < 6) {
                this.props.error = "Password needs to be at least 6 characters";
                this.setState({ displayErrorMessage: true });
            }
            else {
                if (this.validateEmail(this.props.email)) {
                    this.props.onSignUpWithEmail.bind(this)(event); // I had to ask this to interwebs http://stackoverflow.com/questions/40308828/react-doesnt-fire-function-in-component
                }
                else {
                    this.props.error = "Enter a valid email";
                    this.setState({ displayErrorMessage: true });
                }
            }
        }
        else {
            this.props.error = "Passwords do not match.";
            this.setState({ displayErrorMessage: true });
        }
        console.log(this.props.error);
    }

    validateEmail(email: string) {
        let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
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
                            onClick={this.comparePass.bind(this)}>
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
