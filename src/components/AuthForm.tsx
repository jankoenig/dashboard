import * as React from "react";

export interface AuthFormProps {
  signup?: boolean;
}

export default class AuthForm extends React.Component<AuthFormProps, any> {

    render() {
        return <div className="mdl-card__supporting-text">
            <form action="#">
                <div className="mdl-textfield mdl-js-textfield">
                    <input className="mdl-textfield__input" type="text" id="email" />
                    <label className="mdl-textfield__label" for="email">username</label>
                </div>
                <div className="mdl-textfield mdl-js-textfield">
                    <input className="mdl-textfield__input" type="password" id="password" />
                    <label className="mdl-textfield__label" for="password">password</label>
                </div>
                {( () => {
                  if (this.props.signup) {
                  return (
                    <div className="mdl-textfield mdl-js-textfield">
                        <input className="mdl-textfield__input" type="password" id="verifyPassword" />
                        <label className="mdl-textfield__label" for="password">verify password</label>
                    </div>
                  );
                }
              })()}
            </form>
            <div className="mdl-card__actions mdl-card--border">
                <button className="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect">Log in</button>
            </div>
        </div>;
    }
}
