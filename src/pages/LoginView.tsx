
import * as React from "react";
import { connect } from "react-redux";

import { changeForm } from "../actions/authForm";
import Card from "../components/Card";
import { Grid, Cell } from "../components/Grid";
import AuthForm from "../components/AuthForm";
import { FormState } from "../reducers/form"; // Not sure if I like this pattern yet

interface Props extends React.Props<any> {
    email: string;
    password: string;
    changeForm: (state: FormState) => void;
};

function mapStateToProps(state: any) {
    return {
        email: state.form.email,
        password: state.form.password
    };
}

function mapDispatchToProps(dispatch: any) {
    return {
        changeForm: (formState: FormState): void => dispatch(changeForm(formState))
    };
}

class HomeView extends React.Component<Props, any> {

    handleFormChanged(event: React.FormEvent) {
        // Need to cast in order to get to value and name 
        // See http://stackoverflow.com/a/39214607/1349766
        let target = event.target as HTMLSelectElement;
        let formState: FormState = { [target.id]: target.value };
        this.props.changeForm(formState);
    }

    handleFormSubmit(event: React.FormEvent) {
        event.preventDefault();
        console.log("form submit");
        console.log(this.props.email);
        console.log(this.props.password);
    }

    render() {
        return (
            <Grid>
                <Cell col={4} />
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
                <Cell col={4} />
            </Grid>
        );
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(HomeView);
