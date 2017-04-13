import * as React from "react";
import { connect } from "react-redux";
import { Redirect, Route, RouteComponentProps, Switch } from "react-router";
import { replace } from "react-router-redux";

import { State } from "../reducers";

import LinkRoute from "./LinkRoute";
import NewSourceRoute from "./NewSourceRoute";
import NotFoundRoute from "./NotFoundRoute";
import SetSourceRoute from "./SetSourceRoute";
import SourceListRoute from "./SourceListRoute";

import Dashboard from "../frames/Dashboard";
import User from "../models/user";

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
        const { currentUser, location } = this.props;
        const loggedIn = currentUser !== undefined;
        return (loggedIn) ?
            (
                <Dashboard location={location}>
                    <ProtectedRoutes />
                </Dashboard>
            )
            :
            (
                <Redirect
                    to={{
                        pathname: "/login",
                        state: { from: location }
                    }}
                    push={false} />)
            ;
    }
}

export default connect(
    mapStateToProps,
    mapStateToDispatch,
    mergeProps)
    (AuthCheckRoute);

export class ProtectedRoutes extends React.Component<any, any> {
    render() {
        return (
            <div>
                <Switch>
                    <Route path="/" exact component={LinkRoute} />
                    <Route path="/skills" exact component={SourceListRoute} />
                    <Route path="/skills/new" component={NewSourceRoute} />
                    <Route path="/skills/:sourceId" component={SetSourceRoute} />
                    <Route component={NotFoundRoute} />);
                </Switch>
            </div>);
    }
}