import { connect } from "react-redux";
import { RouteComponentProps } from "react-router";

import CancelableComponent from "./components/CancelableComponent";
import IndexUtils from "./index-utils";
import Source from "./models/source";
import { State } from "./reducers";

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

export class SetSourceRoute extends CancelableComponent<SourceRouteProps, any> {

    componentWillReceiveProps(props: SourceRouteProps, context: any) {
        super.componentWillReceiveProps(props, context);
        this.getNewSource(props);
    }

    componentWillMount() {
        this.getNewSource(this.props);
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        this.props.removeCurrentSource();
    }

    getNewSource(props: SourceRouteProps) {
        const { currentSources, match, setCurrentSource } = props;
        const { sourceId } = match.params;
        const promise = setCurrentSource(sourceId, currentSources);
        return this.resolve(promise);
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
)(SetSourceRoute);