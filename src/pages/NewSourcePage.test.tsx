import * as chai from "chai";
import { shallow } from "enzyme";
// tslint:disable:no-unused-variable
import * as React from "react"; // Needed for enzyme, unused for some reason.
// tslint:enable:no-unused-variable

import { NewSourcePage } from "./NewSourcePage";

let expect = chai.expect;

describe("New Source Page", function() {
    it("should render subcomponents", function() {
        const wrapper = shallow(<NewSourcePage />);
        expect(wrapper.find("SourceForm")).to.have.length(1);
    });
});