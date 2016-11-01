import * as React from "react";

import FormInput from "./FormInput";
import { Icon, ICON } from "./Icon";

export interface AuthFormProps {
    email?: string;
    password?: string;
    error?: string;
    onChange?: (event: React.FormEvent) => any;
    onSubmit: (event: React.FormEvent) => void;
    onLoginWithGithub?: (event: React.FormEvent) => void;
}

export default class AuthForm extends React.Component<AuthFormProps, any> {

    constructor(props: AuthFormProps) {
        super(props);
    }

    render() {
        return (
            <div className="mdl-card__supporting-text">
                <form id="auth">
                    <FormInput label={"Email"} type={"text"} floatingLabel={true} value={this.props.email} onChange={this.props.onChange}  />
                    <FormInput label={"Password"} type={"password"} floatingLabel={true} value={this.props.password} onChange={this.props.onChange} />
                </form>
                <div className="mdl-card__actions mdl-card--border">
                    {/* I could not get the <form onSubmit> to work, had to use onClick */}
                    <button
                        className="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect"
                        onClick={this.props.onSubmit}>
                        Login
                    </button>
                </div>
                {this.props.onLoginWithGithub ? (
                    <div className="mdl-card__actions mdl-card--border">
                        <button
                            className="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect"
                            onClick={this.props.onLoginWithGithub}>
                            <Icon style={ {marginRight: "13px"} } width={ 20 } height={ 20 } icon={ ICON.GITHUB } />
                            Login with Github
                        </button>
                    </div>
                ) : undefined}
            </div>);
    }
}
