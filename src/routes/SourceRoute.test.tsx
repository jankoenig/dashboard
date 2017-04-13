import * as chai from "chai";
import { mount, ReactWrapper } from "enzyme";
import * as React from "react";
import { Provider } from "react-redux";
import { MemoryRouter, Route } from "react-router";
import { createStore } from "redux";

import SourcePage from "../pages/sourcepage/SourcePage";
import SourceRoute from "./SourceRoute";

import rootReducer from "../reducers";

let jsdom = require("mocha-jsdom");

const expect = chai.expect;

describe("SourceRoute", function () {
    describe("Render", function () {

        jsdom();

        let wrapper: ReactWrapper<any, any>;

        before(function () {
            // Need to create some fake store for a full render.
            const store = createStore(rootReducer);
            wrapper = mount(
                <Provider store={store}>
                    <MemoryRouter>
                        <Route path="/" component={SourceRoute} />
                    </MemoryRouter>
                </Provider>
            );
        });

        it("Tests that the Source Page is shown.", function () {
            expect(wrapper.find(SourcePage)).to.have.length(1);
        });
    });
});