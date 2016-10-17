import * as chai from "chai";
import { shallow } from "enzyme";
// tslint:disable:no-unused-variable
import * as React from "react"; // Needed for enzyme, unused for some reason.
// tslint:enable:no-unused-variable

import Header from "./Header";

let expect = chai.expect;

describe("Header", function () {
    it("renders correctly", function() {
        const wrapper = shallow(<Header />);
        expect(wrapper.find("header")).to.have.length(1);
    });
    describe("with title", function () {
        it("renders correctly", function() {
            const wrapper = shallow(<Header title="title"/>);
            expect(wrapper.find("span").text()).to.have.equal("title");
        });
    });
});