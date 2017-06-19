import * as React from "react";
import { connect } from "react-redux";

import Source from "../../models/source";
import { State } from "../../reducers";
import IntegrationSpokes from "../integration/IntegrationSpokes";

interface StateSettingsProps {
    source: Source;
}

interface StateSettingsState {
}

function mapStateToProps(state: State.All) {
    return {
        source: state.source.currentSource
    };
}

export class StateSettingsPage extends React.Component<StateSettingsProps, StateSettingsState> {
    render() {
        const { source } = this.props;
        return (
            <IntegrationSpokes source={source} />
        );
    }
}

export default connect(
    mapStateToProps
)(StateSettingsPage);
