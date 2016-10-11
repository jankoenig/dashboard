
import * as React from "react";
import { connect } from "react-redux";
import { Link } from "react-router";

import { increment, decrement } from '../actions/counter';
import Hello from "../components/Hello";
import Counter from "../components/Counter";

interface ICounterPageProps extends React.Props<any> {
    counter: number;
    increaseCounter: () => void;
    decreaseCounter: () => void;
};

function mapStateToProps(state: any) {
    console.log("mapStateToProps");
    console.log(state);
    return {
        counter: state.counter.get('count'),
    };
}

function mapDispatchToProps(dispatch: any) {
    return {
        increaseCounter: (): void => dispatch(increment()),
        decreaseCounter: (): void => dispatch(decrement()),
    };
}

class HomeView extends React.Component<ICounterPageProps, any> {

    render() {
        return (
            <div>
                <h2>Home</h2>
                <Hello name="world" />
                <div><Link to="/about">About</Link></div>
                <Counter
                    counter={this.props.counter}
                    increment={this.props.increaseCounter}
                    decrement={this.props.decreaseCounter} />
            </div>
        );
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(HomeView);
