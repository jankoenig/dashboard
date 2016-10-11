import * as React from "react";

import { login } from "../actions/session";
import { FormState, form } from "../reducers/form";

export interface AuthFormProps {
    signup?: boolean;
}

export default class AuthForm extends React.Component<AuthFormProps, FormState> {

    constructor(props: any) {
        console.log("constructing AuthForm");
        super(props);
    }

    handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        console.log("onSubmit");
        console.log(e);
        login();
        // this.props.dispatch(login({email: "hi", password: "pass"}));
    }

    render() {
        return (
            <div className="mdl-card__supporting-text">
                <form onSubmit={e => this.handleSubmit(e)}>
                    <div className="mdl-textfield mdl-js-textfield">
                        <input className="mdl-textfield__input" type="text" id="email" />
                        <label className="mdl-textfield__label" for="email">username</label>
                    </div>
                    <div className="mdl-textfield mdl-js-textfield">
                        <input className="mdl-textfield__input" type="password" id="password" />
                        <label className="mdl-textfield__label" for="password">password</label>
                    </div>
                    {this.props.signup ? (
                        <div className="mdl-textfield mdl-js-textfield">
                            <input className="mdl-textfield__input" type="password" id="verifyPassword" />
                            <label className="mdl-textfield__label" for="password">verify password</label>
                        </div>
                    ) : null
                    }
                    <div className="mdl-card__actions">
                        <button className="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect">Log in</button>
                    </div>
                </form>
            </div>);
    }
}
