import * as chai from "chai";
import { mount } from "enzyme";
import { createMemoryHistory, History } from "history";
import * as React from "react";
import { Route, Router } from "react-router-dom";

let jsdom = require("mocha-jsdom");

import { Source } from "../models/source";
import { dummySources } from "../utils/test";
import { SourceListPage } from "./SourceListPage";
import WelcomePage from "./WelcomePage";

import { Button } from "react-toolbox/lib/button";

import List from "../components/List/List";

let expect = chai.expect;

describe("Source List Page", function () {

    let sources: Source[];
    let history: History;

    before(function () {
        sources = dummySources(4);
        history = createMemoryHistory("/");
    });

    describe("Full render", function () {

        jsdom();

        it("should render correctly", function () {
            // Need the router when using "mount" because this page has a "Link" item which requires a "History".
            const wrapper = mount(
                <Router history={history} >
                    <Route path="/">
                        <SourceListPage sources={sources} />
                    </Route>
                </Router>);

            let twoPaneWrapper = wrapper.find("TwoPane");
            let leftSide = twoPaneWrapper.find(".source_list_page_left");
            let rightSide = twoPaneWrapper.find(".source_list_page_right");

            expect(leftSide.find(List)).to.have.prop("length", 4);
            expect(leftSide.find(Button)).to.have.length(1);

            expect(rightSide.find(WelcomePage)).to.have.length(1);
        });
    });
});