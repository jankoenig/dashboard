import * as Bluebird from "bluebird";
import * as React from "react";

export enum LoadingState {
    NOT_LOADING, LOADING, LOADED, LOAD_ERROR
}

export interface LoadingComponentProps {

}

export interface LoadingComponentState<DATA> {
    data: DATA;
    state: LoadingState;
}

/**
 * A loading component that is designed to load data asyncronously from the component. It will automatically cancel
 * if the data was not loaded and the component was unmounted or received new props.  Overriding components can
 * override the various methods to perform during the loading chain.
 *
 * The loading state is handled by this component and shoud not be written to outside of it.  In other words,
 * don't ever overwrite the state object like "this.state = <some new state>".
 */
export default class LoadingComponent<DATA, P extends LoadingComponentProps, S extends LoadingComponentState<DATA>> extends React.Component<P, S> {

    loadingPromise: Bluebird<any>;
    lastLoadedProps: P;

    constructor(props: P) {
        super(props);

        this.startLoading = this.startLoading.bind(this);
        this.map = this.map.bind(this);

        const st = this.state as any || {};
        this.state = { ...st, ...{ state: LoadingState.NOT_LOADING, data: undefined } };
    }

    /**
     * Children can override this to determine if the new props warrents an update.  If not, then no update will occur.
     * Default is always true.
     * @param newProps
     *      New props to check.
     * @param oldProps
     *      Old props to check against.
     */
    shouldUpdate(newProps: P, oldProps: P) {
        return true;
    }

    /**
     * Overriding components *must* call the super of this method.
     */
    componentWillReceiveProps(newProps: P, context: any) {
        if (this.shouldUpdate(newProps, this.props)) {
            this.forceLoading(newProps);
        }
    }

    /**
     * Overriding components *must* call the super of this method.
     */
    componentWillMount() {
        if (this.lastLoadedProps !== this.props) {
            this.forceLoading(this.props);
        }
    }

    /**
     * Overriding components *must* call the super of this method.
     */
    componentWillUnmount() {
        this.cancel();
    }

    /**
     * Force a reload of the data.
     */
    forceLoading(props: P) {
        this.cancel();
        this.setState({ state: LoadingState.LOADING } as any); // Need the "as any" to overcome the typescript stuff
        this.loadingPromise = Bluebird.resolve(this.startLoading(props))
            .then(this.map)
            .then((data: DATA) => {
                return this.mapState({ data: data, state: LoadingState.LOADED });
            })
            .then((state: S) => {
                this.setState(state);
                // Save it now in case we got canceled.
                this.lastLoadedProps = props;
            });
    }

    startLoading<T>(props: P): Thenable<T> {
        return Promise.resolve();
    }

    map<FROM, TO>(data: FROM): Thenable<TO> | TO {
        return data as any;
    }

    cancel() {
        if (this.loadingPromise) {
            this.loadingPromise.cancel();
        }
    }

    /**
     * Maps an object to the current state without updating the state. This may be necessary in the
     * long processes so `setState` is only called once in a chain.
     */
    mapState(obj: any): S {
        const currentState = this.state as any;
        return { ...currentState, ...obj };
    }

    render() {
        // Mostly to allow testing.  This won't actually show anything because that's the children's responsibility.
        return (<div />);
    }
}