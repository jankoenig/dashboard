import * as chai from "chai";
import { mount, ReactWrapper, shallow, ShallowWrapper } from "enzyme";
import { Location } from "history";
import * as React from "react";
import { Provider } from "react-redux";
import { MemoryRouter, Redirect, Route } from "react-router";
import { createStore, Store } from "redux";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

import User from "../models/user";
import rootReducer, { State } from "../reducers";

import ConnectedAuthCheckRoute, { AuthCheckRoute } from "./AuthCheckRoute";

import Dashboard from "../frames/Dashboard";

const jsdom = require("mocha-jsdom");

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
                const redirect = wrapper.find(Redirect);
                expect(redirect).to.have.length(1);
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

    });

    xdescribe("Full render", function () {

        jsdom();

        describe("Not logged in.", function () {
            let store: Store<State.All>;
            let wrapper: ReactWrapper<any, any>;

            before(function () {
                store = createStore(rootReducer);
            });

            beforeEach(function () {
                wrapper = mount(
                    <Provider store={store}>
                        <MemoryRouter>
                            <Route path="/" component={AuthCheckRoute} />
                        </MemoryRouter>
                    </Provider>
                );
            });

            it("Tests that the main items are *not* displayed.", function () {
                expect(wrapper.find(Dashboard)).to.have.length(0);
                expect(wrapper.find(Route)).to.have.length(0);
            });
        });

        describe("Logged in.", function () {
            let user: User;
            let store: Store<State.All>;
            let wrapper: ReactWrapper<any, any>;

            before(function () {
                user = {
                    userId: "ABC123",
                    displayName: "Test User",
                    email: "test@test.com"
                };
                const prestate: State.All = {
                    authForm: undefined,
                    log: undefined,
                    notification: undefined,
                    routing: undefined,
                    session: {
                        user: user,
                        hasError: true,
                        isLoading: true
                    },
                    source: undefined
                };
                store = createStore(rootReducer, prestate, undefined);
            });

            beforeEach(function () {
                wrapper = mount(
                    <Provider store={store}>
                        <MemoryRouter>
                            <Route path="/" component={ConnectedAuthCheckRoute} />
                        </MemoryRouter>
                    </Provider>
                );
            });

            it("Tests that the main items are displayed.", function () {
                expect(wrapper.find(Dashboard)).to.have.length(1);
                expect(wrapper.find(Route)).to.have.length(5);
            });
        });
    });
});