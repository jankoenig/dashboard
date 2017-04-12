import * as React from "react";
import { connect } from "react-redux";
import { Redirect, RouteComponentProps } from "react-router";
import { replace } from "react-router-redux";


import { State } from "./reducers";

import Dashboard from "./frames/Dashboard";
import User from "./models/user";

/**
 * Checks if the user exists before entering routes that require a user.
 *
 * See below on the onEnter method.
 */
// let checkAuth: EnterHook = function (nextState: RouterState, replace: RedirectFunction) {
//     const session: any = store.getState().session;
//     if (!session.user) {
//         replace({
//             pathname: "/login",
//             query: nextState.location.query,
//             state: { nextPathName: nextState.location.pathname, query: nextState.location.query }
//         });
//     }
// };

interface StateProps {
    currentUser: User;
}

interface DispatchProps {
    goTo: (path: string) => Thenable<void>;
}

interface StandardProps extends RouteComponentProps<void> {
    // Doing it this way enforces the "mergeProps" and keeps Typescript happy.
}

interface AuthCheckProps extends StateProps, DispatchProps, StandardProps {
}

function mapStateToProps(state: State.All): StateProps {
    return {
        currentUser: state.session.user
    };
}

function mapStateToDispatch(dispatch: any): DispatchProps {
    return {
        goTo: function (path: string): Thenable<void> {
            return dispatch(replace(path));
        }
    };
}

function mergeProps(state: StateProps, dispatch: DispatchProps, standard: StandardProps): AuthCheckProps {
    return { ...state, ...dispatch, ...standard };
}

export class AuthCheckRoute extends React.Component<AuthCheckProps, any> {

    render() {
        const { currentUser, children, location } = this.props;
        const loggedIn = currentUser !== undefined;
        return (
            <Dashboard>
                {(loggedIn) ? (children) : (
                    <Redirect to={{
                        pathname: "/login",
                        state: { from: location }
                    }}
                        push={false} />)
                }
            </Dashboard>
        );
    }
}

export default connect(
    mapStateToProps,
    mapStateToDispatch,
    mergeProps)
(AuthCheckRoute);