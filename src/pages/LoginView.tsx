
import * as React from "react";
import { connect } from "react-redux";

import { increment, decrement } from '../actions/counter';
 import { changeForm } from "../actions/authForm";
import Counter from "../components/Counter";
import Card from "../components/Card";
import { Grid, Cell } from "../components/Grid";
import AuthForm from "../components/AuthForm";
import { FormState } from "../reducers/form"; // Not sure if I like this pattern yet

interface Props extends React.Props<any> {
    counter: number;
    email: string;
    increaseCounter: () => void;
    decreaseCounter: () => void;
    changeForm: (state: FormState) => void;
};

function mapStateToProps(state: any) {
    console.log("mapStateToProps");
    console.log(state);
    return {
        counter: state.counter.get('count'),
        email: state.form.email
    };
}

function mapDispatchToProps(dispatch: any) {
    return {
        increaseCounter: (): void => dispatch(increment()),
        decreaseCounter: (): void => dispatch(decrement()),
        changeForm: (formState: FormState): void => dispatch(changeForm(formState))
    };
}

class HomeView extends React.Component<Props, any> {

    handleFormChanged(event: React.FormEvent) {
        // Need to cast in order to get to value and name 
        // See http://stackoverflow.com/a/39214607/1349766
        let target = event.target as HTMLSelectElement;
        console.log(target.value);
        console.log(target.id);
        let formState: FormState = { [target.id]: target.value };
        console.log(formState);
        this.props.changeForm(formState);
    }

    handleFormSubmit(event: React.FormEvent) {
        event.preventDefault();
        console.log("form submit");
    }

    render() {
        return (
            <Grid>
                <Cell col={4} />
                <Cell col={4} align={"middle"}>
                    <Card>
                        <Counter
                            counter={this.props.counter}
                            increment={this.props.increaseCounter}
                            decrement={this.props.decreaseCounter} />
                    </Card>
                    <Card>
                        <AuthForm
                            email={this.props.email}
                            onSubmit= {this.handleFormSubmit.bind(this)}
                            onChange= {this.handleFormChanged.bind(this)}
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
