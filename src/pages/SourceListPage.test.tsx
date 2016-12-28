import * as chai from "chai";
import { mount } from "enzyme";
// tslint:disable:no-unused-variable
import * as React from "react"; // Needed for enzyme, unused for some reason.
// tslint:enable:no-unused-variable

let jsdom = require("mocha-jsdom");

import { dummySources } from "../utils/test";
import { SourceListPage } from "./SourceListPage";

let expect = chai.expect;

describe("Source List Page", function () {

    describe("Full render", function () {

        jsdom();

        it("should render correctly", function () {

            const sources = dummySources(4);
            const wrapper = mount(<SourceListPage sources={sources} />);

            let twoPaneWrapper = wrapper.find("TwoPane");
            let leftSide = twoPaneWrapper.find(".source_list_page_left");
            let rightSide = twoPaneWrapper.find(".source_list_page_right");

            expect(leftSide.find("List").find("Link")).to.have.length(4);
            expect(leftSide.find("Button")).to.have.length(1);

            expect(rightSide.find("HomePage")).to.have.length(1);
        });
    });
});