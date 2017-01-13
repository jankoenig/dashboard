import * as chai from "chai";
import { shallow } from "enzyme";
import * as React from "react";

import Pill from "./Pill";

let expect = chai.expect;

describe("Pill", function() {
    it("renders correctly", function() {
        const wrapper = shallow(<Pill>text</Pill>);

        expect(wrapper.find("span")).to.have.length(1);
        expect(wrapper.text()).to.equal("text");
    });
});