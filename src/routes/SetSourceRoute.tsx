import * as React from "react";
import { connect } from "react-redux";
import { Route, RouteComponentProps } from "react-router";

import ConvoRoute from "./ConvoRoute";
import IntegrationRoute from "./IntegrationRoute";
import SourceRoute from "./SourceRoute";

import CancelableComponent from "../components/CancelableComponent";
import IndexUtils from "../index-utils";
import Source from "../models/source";
import { State } from "../reducers";

interface Query {
    sourceId: string;
}

interface StateProps {
    currentSources: Source[];
}

interface DispatchProps {
    setCurrentSource: (sourceId: string, sources: Source[]) => Thenable<Source>;
    removeCurrentSource: () => void;
}

interface StandardProps extends RouteComponentProps<Query> {
    // Doing it this way enforces the "mergeProps" and keeps Typescript happy.
}

interface SourceRouteProps extends DispatchProps, StateProps, StandardProps {
}

interface SourceRouteState {
    source: Source;
}

function mapStateToProps(state: State.All): StateProps {
    return {
        currentSources: state.source.sources
    };
}

function mapDispatchToProps(dispatch: any): DispatchProps {
    return {
        setCurrentSource: (sourceId: string, sources: Source[]): Thenable<Source> => {
            return IndexUtils.dispatchSelectedSourceSource(dispatch, sourceId, sources);
        },
        removeCurrentSource: (): void => {
            IndexUtils.removeSelectedSource(dispatch);
        }
    };
}

function mergeProps(state: StateProps, dispatch: DispatchProps, standard: StandardProps): SourceRouteProps {
    return { ...state, ...dispatch, ...standard };
}

export class SetSourceRoute extends CancelableComponent<SourceRouteProps, SourceRouteState> {

    constructor(props: SourceRouteProps) {
        super(props);
        this.state = {
            source: undefined
        };
    }

    componentWillReceiveProps(props: SourceRouteProps, context: any) {
        super.componentWillReceiveProps(props, context);
        console.info("Props");
        this.getNewSource(props);
    }

    componentWillMount() {
        console.info("Mounting");
        this.getNewSource(this.props);
    }

    componentWillUnmount() {
        console.info("Unmounting.");
        super.componentWillUnmount();
        this.props.removeCurrentSource();
    }

    getNewSource(props: SourceRouteProps) {
        const { currentSources, match, setCurrentSource } = props;
        const { sourceId } = match.params;
        const promise = setCurrentSource(sourceId, currentSources)
            .then((source: Source) => {
                console.log("Setting state " + source.id);
                this.setState({ source: source });
            });
        return this.resolve(promise);
    }

    render() {
        const { source } = this.state;
        if (source) {
            console.info("Has source " + source.id + " " + this.props.location.pathname);
            return (
                <div>
                    <Route path="/skills/:sourceId/" exact component={SourceRoute} />
                    <Route path="/skills/:sourceId/logs" component={ConvoRoute} />
                    <Route path="/skills/:sourceId/integration" component={IntegrationRoute} />
                </div>
            );
        } else {
            console.info("Does not have state.");
            return (<div/>);
        }
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
)(SetSourceRoute);