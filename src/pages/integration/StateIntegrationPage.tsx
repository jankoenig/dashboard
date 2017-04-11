import * as React from "react";
import { connect } from "react-redux";

import Source from "../../models/source";
import { State } from "../../reducers";
import IntegrationPage from "./IntegrationPage";

interface StateIntegrationProps {
    readonly source: Source;
}

interface StateIntegrationState {
}

function mapStateToProps(state: State.All) {
    return {
        source: state.source.currentSource
    };
}

export class StateIntegrationPage extends React.Component<StateIntegrationProps, StateIntegrationState> {

    render() {
        const { source } = this.props;
        return (
            <IntegrationPage source={source} />
        );
    }
}

export default connect(
    mapStateToProps
)(StateIntegrationPage);