/**
 * Routing data objects that are appended to React.Component props objects through the
 * react-router-redux reducers.
 */

declare namespace RoutingData {
    export interface Location<S> {
        action: string,
        baseName: string,
        hash: string,
        key: string,
        pathName: string,
        state: S
    }
}