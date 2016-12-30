import * as chai from "chai";
import { mount } from "enzyme";
// tslint:disable:no-unused-variable
import * as React from "react"; // Needed for enzyme, unused for some reason.
// tslint:enable:no-unused-variable

let jsdom = require("mocha-jsdom");

import { Source } from "../models/source";
import { dummySources } from "../utils/test";
import { SourceListPage } from "./SourceListPage";

let expect = chai.expect;

describe("Source List Page", function () {

    let sources: Source[];

    before(function() {
        sources = dummySources(4);
    });

    describe("Full render", function () {

        jsdom();

        it("should render correctly", function () {
            const wrapper = mount(<SourceListPage sources={sources} />);

            let twoPaneWrapper = wrapper.find("TwoPane");
            let leftSide = twoPaneWrapper.find(".source_list_page_left");
            let rightSide = twoPaneWrapper.find(".source_list_page_right");

            expect(leftSide.find("StaticList").find("ListItem")).to.have.length(4);
            expect(leftSide.find("Button")).to.have.length(1);

            expect(rightSide.find("HomePage")).to.have.length(1);
        });
    });
});