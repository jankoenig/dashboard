import * as chai from "chai";
import { shallow } from "enzyme";
// tslint:disable:no-unused-variable
import * as React from "react"; // Needed for enzyme, unused for some reason.
// tslint:enable:no-unused-variable

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
