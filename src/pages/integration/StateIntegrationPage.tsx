import * as React from "react";
import { connect } from "react-redux";

import Source from "../../models/source";
import { State } from "../../reducers";
import IntegrationPage from "./IntegrationPage";

interface StateIntegrationProps {
    source: Source;
}

interface StateIntegrationState {
    secretKey: string;
}

function mapStateToProps(state: State.All) {
    return {
        source: state.source.currentSource
    };
}

export class StateIntegrationPage extends React.Component<StateIntegrationProps, StateIntegrationState> {

    constructor(props: StateIntegrationProps) {
        super(props);

        this.state = {
            secretKey: (props.source) ? props.source.secretKey : undefined
        };
    }

    componentWillReceiveProps(props: StateIntegrationProps, context: any) {
        this.state.secretKey = (props.source) ? props.source.secretKey : undefined;
        this.setState(this.state);
    }

    render() {
        return (
            <IntegrationPage secretKey={this.state.secretKey} />
        );
    }
}

export default connect(
    mapStateToProps
)(StateIntegrationPage);