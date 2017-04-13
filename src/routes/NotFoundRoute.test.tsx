import * as chai from "chai";
import { mount, ReactWrapper } from "enzyme";
import * as React from "react";
import { Provider } from "react-redux";
import { MemoryRouter, Route } from "react-router";
import { createStore } from "redux";

import NotFoundPage from "../pages/NotFoundPage";
import NotFoundRoute from "./NotFoundRoute";

import rootReducer from "../reducers";

let jsdom = require("mocha-jsdom");

const expect = chai.expect;

describe("NotFoundRoute", function () {
    describe("Render", function () {

        jsdom();

        let wrapper: ReactWrapper<any, any>;

        before(function () {
            // Need to create some fake store for a full render.
            const store = createStore(rootReducer);
            wrapper = mount(
                <Provider store={store}>
                    <MemoryRouter>
                        <Route path="/" component={NotFoundRoute} />
                    </MemoryRouter>
                </Provider>
            );
        });

        it("Tests that the Not Found Page is shown.", function () {
            expect(wrapper.find(NotFoundPage)).to.have.length(1);
        });
    });
});