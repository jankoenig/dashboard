import * as React from "react";
import { RouteComponentProps } from "react-router";

import Login from "./frames/Login";
import LoginPage from "./pages/LoginPage";

interface LoginProps extends RouteComponentProps<any> {

}

export class LoginRoute extends React.Component<LoginProps, any>  {
    render() {
        return (
            <Login >
                <LoginPage />
            </Login>
        );
    }
}

export default LoginRoute;