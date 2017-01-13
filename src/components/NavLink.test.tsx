import * as chai from "chai";
import { shallow } from "enzyme";
import * as React from "react";

import NavLink from "./NavLink";

let expect = chai.expect;

describe("NavLink", function() {
    it("renders correctly", function() {
        const wrapper = shallow(<NavLink name="name" path="/" />);
        expect(wrapper.find("Link")).to.have.length(1);
    });
    describe("with icon", function() {
        it("renders correctly", function() {
            const wrapper = shallow(<NavLink name="name" path="/" icon="icon" />);
            expect(wrapper.find("Link")).to.have.length(1);
            expect(wrapper.find("i")).to.have.length(1);
        });
    });
});
