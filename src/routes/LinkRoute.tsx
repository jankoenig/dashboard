import { Location } from "history";
import * as React from "react";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router";
import { replace } from "react-router-redux";

import * as CancelableComponent from "../components/CancelableComponent";
import IndexUtils from "../index-utils";
import Source from "../models/source";
import User from "../models/user";
import { State } from "../reducers";
import SourceService from "../services/source";

import "url-search-params-polyfill"; // This just needs to exist.

interface Query {
    id?: string;
    key?: string;
}

interface StateProps {
    currentUser: User;
}

interface DispatchProps {
    goTo: (path: string) => Thenable<any>;
}

interface StandardProps extends RouteComponentProps<Query> {

}

interface LinkRouteProps extends StateProps, DispatchProps, StandardProps {

}

interface LinkRouteState {

}

function mapStateToProps(state: State.All): StateProps {
    return {
        currentUser: state.session.user
    };
}

function mapStateToDispatch(dispatch: any): DispatchProps {
    return {
        goTo: function (path: string) {
            return dispatch(replace(path));
        }
    };
}

function mergeRemainingProps(stateProps: StateProps, dispatchProps: DispatchProps, standardProps: StandardProps): LinkRouteProps {
    return { ...stateProps, ...dispatchProps, ...standardProps };
}

function checkParams(query: Query): Promise<Query> {
    const { id, key } = query;
    return new Promise(function (resolve: (id: Query) => void, reject: (err: Error) => void) {
        if (id && key) {
            resolve({ id: id, key: key });
        } else {
            reject(new Error("Both ID and Key must be provided."));
        }
    });
}

interface QueryResult {
    source: Source;
    query: Query;
}

function linkSource(query: Query, user: User): Promise<QueryResult> {
    const { id, key } = query;
    console.info("LINKING " + id + " " + key);
    return SourceService.linkSource({ id: id, secretKey: key }, user)
        .then(function (result: SourceService.LinkResult) {
            console.info("RESULT");
            console.log(result);
            return { source: result.source, query: query };
        });
}

function getSource(sources: Source[], query: Query): Promise<QueryResult> {
    return IndexUtils.findSource(sources, query.id)
        .then(function (source: Source) {
            return { source: source, query: query };
        });
}

function checkResult(result: QueryResult): string {
    const { source, query } = result;
    if (source.secretKey === query.key) {
        return query.id;
    } else {
        throw new Error("Keys do not match.");
    }
}

function getQuery(location: Location): Query {
    const urlParams = new URLSearchParams(location.search);
    const id = urlParams.get("id");
    const key = urlParams.get("key");
    return { id: id, key: key };
}

export class LinkRoute extends CancelableComponent.CancelableComponent<LinkRouteProps, LinkRouteState> {

    componentWillMount() {
        console.log(this.props.location);
        const { goTo, location } = this.props;
        const query = getQuery(location);
        if (!query.id && !query.key) {
            // Params were not passed to us.  Just move on.
            console.info("GOING TO SKILLS");
            goTo("/skills");
        } else {
            this.reroute(this.props);
        }
    }

    reroute(props: LinkRouteProps): Promise<any> {
        const { goTo, currentUser, location } = this.props;
        const query = getQuery(location);

        console.info("REROUTE");
        console.log(location);
        console.log(query);
        const promise = checkParams(query)
            .then(function (query: Query) {
                return linkSource(query, currentUser)
                    .then(function (queryResult: QueryResult) {
                        // Re-query latest
                        console.info("REQUERYING");
                        return getSource([], query);
                    });
            }).catch(function (err: Error) {
                // Fallback.  Maybe we already own it.
                console.info("Getting source for " + query);
                console.log(query);
                return getSource([], query);
            }).then(function (query: QueryResult) {
                console.info("Checking query result.");
                console.log(query);
                return checkResult(query);
            }).then(function (id: string) {
                goTo("/skills/" + id);
            }).catch(function (err: Error) {
                console.error(err);
                goTo("/notFound");
            });
        return this.resolve(promise);
    }

    render() {
        return (<div />);
    }
}

export default connect(
    mapStateToProps,
    mapStateToDispatch,
    mergeRemainingProps)
    (LinkRoute);