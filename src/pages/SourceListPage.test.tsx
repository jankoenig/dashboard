import * as chai from "chai";
import { shallow } from "enzyme";
// tslint:disable:no-unused-variable
import * as React from "react"; // Needed for enzyme, unused for some reason.
// tslint:enable:no-unused-variable

import {dummySources} from "../utils/test";
import { SourceListPage } from "./SourceListPage";


let expect = chai.expect;

describe("Source List Page", function() {
    it("should render correctly", function() {

        const sources = dummySources(4);
        const wrapper = shallow(<SourceListPage sources={sources} />);

        expect(wrapper.find("Link")).to.have.length(4);

    });
});