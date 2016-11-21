import * as chai from "chai";
import { shallow } from "enzyme";
// tslint:disable:no-unused-variable
import * as React from "react"; // Needed for enzyme, unused for some reason.
// tslint:enable:no-unused-variable

import Pill from "./Pill";

let expect = chai.expect;

describe("Pill", function() {
    it("renders correctly", function() {
        const wrapper = shallow(<Pill>text</Pill>);

        expect(wrapper.find("span")).to.have.length(1);
        expect(wrapper.text()).to.equal("text");
    });
});