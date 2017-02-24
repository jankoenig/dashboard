import * as React from "react";
import { connect } from "react-redux";

import { State } from "../reducers";

interface MetricsPageProps {

}

interface MetricsPageState {

}

function mapStateToProps(state: State.All) {
    return {
    };
}

function mapDispatchToProps( dispatch: Redux.Dispatch<any>) {
    return {

    };
}

export class MetricsPage extends React.Component<MetricsPageProps, MetricsPageState> {

    render() {
        return (
            <p> Hello World </p>
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MetricsPage);