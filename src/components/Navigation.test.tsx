import * as chai from "chai";
import { shallow } from "enzyme";
import * as React from "react";

import Navigation from "./Navigation";

let expect = chai.expect;

describe("Navigation", function() {
    it("renders correctly", function() {
        const wrapper = shallow(<Navigation name="name" path="/" />);
        expect(wrapper.find("nav")).to.have.length(1);
    });
});
