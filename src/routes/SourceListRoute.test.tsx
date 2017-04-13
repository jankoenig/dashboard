import * as chai from "chai";
import { mount, ReactWrapper } from "enzyme";
import * as React from "react";
import { Provider } from "react-redux";
import { MemoryRouter, Route } from "react-router";
import { createStore } from "redux";

import SourceListPage from "../pages/SourceListPage";
import SourceListRoute from "./SourceListRoute";

import rootReducer from "../reducers";

let jsdom = require("mocha-jsdom");

const expect = chai.expect;

describe("SourceListRoute", function () {
    describe("Render", function () {

        jsdom();

        let wrapper: ReactWrapper<any, any>;

        before(function () {
            // Need to create some fake store for a full render.
            const store = createStore(rootReducer);
            wrapper = mount(
                <Provider store={store}>
                    <MemoryRouter>
                        <Route path="/" component={SourceListRoute} />
                    </MemoryRouter>
                </Provider>
            );
        });

        it("Tests that the Source List Page is shown.", function () {
            expect(wrapper.find(SourceListPage)).to.have.length(1);
        });
    });
});