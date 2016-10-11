import * as React from "react";

import { FormState, form } from "../reducers/form";

export interface AuthFormProps {
    email?: string;
    password?: string;
    error?: string;
    onChange?: (event: React.FormEvent) => any;
    onSubmit: (event: React.FormEvent) => void;
}

export default class AuthForm extends React.Component<AuthFormProps, FormState> {

    constructor(props: AuthFormProps) {
        super(props);
    }

    render() {
        return (
            <div className="mdl-card__supporting-text">
                <form id="auth" onSubmit={this.props.onSubmit}>
                    <div className="mdl-textfield mdl-js-textfield">
                        <input className="mdl-textfield__input" type="text" id="email" value={ this.props.email } onChange={ this.props.onChange } />
                        <label className="mdl-textfield__label" for="email">email</label>
                    </div>
                    <div className="mdl-textfield mdl-js-textfield">
                        <input className="mdl-textfield__input" type="password" id="password" value={ this.props.password } onChange={ this.props.onChange } />
                        <label className="mdl-textfield__label" for="password">password</label>
                    </div>
                    <input type="submit" value="Submit"/>
                </form>
            </div>);
    }
}
