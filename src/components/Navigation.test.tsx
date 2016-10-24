import * as chai from "chai";
import { shallow } from "enzyme";
// tslint:disable:no-unused-variable
import * as React from "react"; // Needed for enzyme, unused for some reason.
// tslint:enable:no-unused-variable

import Navigation from "./Navigation";

let expect = chai.expect;

describe("Navigation", function() {
    it("renders correctly", function() {
        const wrapper = shallow(<Navigation name="name" path="/" />);
        expect(wrapper.find("nav")).to.have.length(1);
    });
});
