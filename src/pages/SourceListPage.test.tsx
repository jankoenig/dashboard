import * as chai from "chai";
import { shallow } from "enzyme";
import * as React from "react";

import {dummySources} from "../utils/test";
import { SourceListPage } from "./SourceListPage";

let expect = chai.expect;

describe("Source List Page", function() {
    it("should render correctly", function() {

        const sources = dummySources(4);
        const wrapper = shallow(<SourceListPage sources={sources} />);

        expect(wrapper.find("Link")).to.have.length(5);
    });
});