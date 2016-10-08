
import * as React from "react";

import Card from "../components/Card";
import AuthForm from "../components/AuthForm";

export default class LoginPage extends React.Component<any, any> {

    render() {
        return (
            <Card>
                <AuthForm />
            </Card>
        );
    }
};
