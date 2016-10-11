
import * as React from "react";
// import { connect } from "react-redux";

import Card from "../components/Card";
import { Grid, Cell } from "../components/Grid";
import AuthForm from "../components/AuthForm";


interface LoginPageProps extends React.Props<any> {
    email: string;
    password: string;
    error?: string;
    loginUser: () => void;
}
/*
function mapStateToProps(state: any) {
    return {
        email: state.session.email,
        password: state.session.password,
        error: state.sesison.error
    };
}

function mapDispatchToProps(dispatch: any) {
    return {
        loginUser: (): void => dispatch(login())
    };
} */

export default class LoginPage extends React.Component<LoginPageProps, any> {

    render() {
        return (
            <Grid>
                <Cell col={4} />
                <Cell col={4} align={"middle"}>
                    <Card>
                        <AuthForm
                            onSubmit={ this.props.loginUser }
                            email={this.props.email}
                            error={this.props.error} />
                    </Card>
                </Cell>
                <Cell col={4} />
            </Grid>
        );
    }
};

/*export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LoginPage); */