import * as chai from "chai";
import { shallow, ShallowWrapper } from "enzyme";
import { Location } from "history";
import * as React from "react";
import { Redirect, Route } from "react-router";
import { createStore, Store } from "redux";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

import User from "../models/user";
import rootReducer, { State } from "../reducers";

import { AuthCheckRoute, ProtectedRoutes } from "./AuthCheckRoute";

import LinkRoute from "./LinkRoute";
import NewSourceRoute from "./NewSourceRoute";
import NotFoundRoute from "./NotFoundRoute";
import SetSourceRoute from "./SetSourceRoute";
import SourceListRoute from "./SourceListRoute";

import Dashboard from "../frames/Dashboard";

chai.use(sinonChai);
const expect = chai.expect;

describe("AuthCheckRoute", function () {

    describe("Shallow Render", function () {

        let goTo: sinon.SinonStub;

        before(function() {
            goTo = sinon.stub();
        });

        afterEach(function() {
            goTo.reset();
        });

        describe("Not logged in.", function () {
            let store: Store<State.All>;
            let wrapper: ShallowWrapper<any, any>;
            let location: Location;

            before(function () {
                store = createStore(rootReducer);
                location = {
                    pathname: "/testPath",
                    search: "",
                    state: {},
                    hash: "TestHash",
                    key: "TestKey"
                };
            });

            beforeEach(function () {
                wrapper = shallow(
                    <AuthCheckRoute
                        history={undefined} // not used
                        match={undefined} // not used
                        location={location}
                        currentUser={undefined}
                        goTo={goTo} />
                );
            });

            it("Tests that the main items are *not* displayed.", function () {
                expect(wrapper.find(Dashboard)).to.have.length(0);
            });

            it("Tests that the redirect is shown.", function() {
                expect(wrapper.find(Redirect)).to.have.length(1);
            });

            it("Tests the redirect props.", function() {
                const redirect = wrapper.find(Redirect).at(0);
                // Checking the "to" prop
                expect(redirect).to.have.prop("to");

                const toProp = redirect.prop("to") as any;
                expect(toProp.pathname).to.equal("/login");
                expect(toProp.state).to.deep.equal({ from : location });
            });
        });

        describe("Logged in.", function () {
            let user: User;
            let store: Store<State.All>;
            let wrapper: ShallowWrapper<any, any>;
            let location: Location;

            before(function () {
                user = {
                    userId: "ABC123",
                    displayName: "Test User",
                    email: "test@test.com"
                };
                store = createStore(rootReducer);
                location = {
                    pathname: "/testPath",
                    search: "",
                    state: {},
                    hash: "TestHash",
                    key: "TestKey"
                };
            });

            beforeEach(function () {
                wrapper = shallow(
                    <AuthCheckRoute
                        history={undefined} // not used
                        match={undefined} // not used
                        location={location}
                        currentUser={user}
                        goTo={goTo} />
                );
            });

            it("Tests that the main items are displayed.", function () {
                expect(wrapper.find(Dashboard)).to.have.length(1);
                expect(wrapper.find(ProtectedRoutes)).to.have.length(1);
            });

            it("Tests that the redirect is not shown.", function() {
                expect(wrapper.find(Redirect)).to.have.length(0);
            });

            describe("Protected component", function() {
                let protectedRoutes: ShallowWrapper<any, any>;

                beforeEach(function() {
                    protectedRoutes = shallow(<ProtectedRoutes />);
                });

                it("Shows that the Link route has the correct path.", function() {
                    const route = protectedRoutes.find(Route).at(0);
                    expect(route).to.have.prop("path", "/");
                    expect(route).to.have.prop("component", LinkRoute);
                });

                it("Shows that the Skills List route has the correct path.", function() {
                    const route = protectedRoutes.find(Route).at(1);
                    expect(route).to.have.prop("path", "/skills");
                    expect(route).to.have.prop("component", SourceListRoute);
                });

                it("Shows that the New Route has the correct path.", function() {
                    const route = protectedRoutes.find(Route).at(2);
                    expect(route).to.have.prop("path", "/skills/new");
                    expect(route).to.have.prop("component", NewSourceRoute);
                });

                it("Shows that the Set Source Route has the correct path.", function() {
                    const route = protectedRoutes.find(Route).at(3);
                    expect(route).to.have.prop("path", "/skills/:sourceId");
                    expect(route).to.have.prop("component", SetSourceRoute);
                });

                it("Shows that the not found page has the correct path.", function() {
                    const route = protectedRoutes.find(Route).at(4);
                    expect(route).to.not.have.prop("path"); // No path because it's a catch-all
                    expect(route).to.have.prop("component", NotFoundRoute);
                });
            });
        });
    });
});