
import * as React from "react";
import { connect } from "react-redux";

import { changeForm } from "../actions/authForm";
import { loginAsync } from "../actions/session";
import Card from "../components/Card";
import { Grid, Cell } from "../components/Grid";
import AuthForm from "../components/AuthForm";

interface Props {
    email: string;
    password: string;
    error: string;
    changeForm: (field: string, value: string) => void;
    login: (email: string, password: string) => (dispatch: Redux.Dispatch<any>) => void;
};

function mapStateToProps(state: any) {
    return {
        email: state.form.email,
        password: state.form.password,
        error: state.form.error
    };
}

function mapDispatchToProps(dispatch: any) {
    return {
        changeForm: (field: string, value: string): void => dispatch(changeForm(field, value)),
        login: (email: string, password: string) => { return dispatch(loginAsync(email, password)); }
    };
}

class LoginPage extends React.Component<Props, any> {

    handleFormChanged(event: React.FormEvent) {
        // Need to cast in order to get to id and value 
        // See http://stackoverflow.com/a/39214607/1349766
        let target = event.target as HTMLSelectElement;
        this.props.changeForm(target.id, target.value);
    }

    handleFormSubmit(event: React.FormEvent) {
        event.preventDefault();
        this.props.login(this.props.email, this.props.password);
    }

    render() {
        return (
            <Grid>
                <Cell col={4} hidePhone={true} hideTablet={true}/>
                <Cell col={4} align={"middle"}>
                    <Card>
                        <AuthForm
                            email={ this.props.email }
                            password= { this.props.password }
                            onSubmit= { this.handleFormSubmit.bind(this) }
                            onChange= { this.handleFormChanged.bind(this) }
                            />
                    </Card>
                </Cell>
                <Cell col={4} hidePhone={true} hideTablet={true}/>
            </Grid>
        );
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LoginPage);
