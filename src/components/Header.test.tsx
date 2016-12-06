import * as chai from "chai";
import { shallow } from "enzyme";
// tslint:disable:no-unused-variable
import * as React from "react"; // Needed for enzyme, unused for some reason.
// tslint:enable:no-unused-variable

import Header from "./Header";

let expect = chai.expect;

describe("Header", function () {
    it("renders correctly", function () {
        const wrapper = shallow(<Header />);
        expect(wrapper.find("header")).to.have.length(1);
    });

    describe("with title", function () {
        it("renders correctly", function () {
            const wrapper = shallow(<Header titles={["title"]} />);
            expect(wrapper.find("span").text()).to.have.equal("title");
            expect(wrapper.find("Select")).to.have.length(0);
        });
    });

    describe("with multiple titles", function() {
        it("renders correctly", function() {
            const wrapper = shallow(<Header titles={["title1", "title2"]} />);
            expect(wrapper.find("span")).to.have.length(0);
            // There should be a munu which lists the titles.
            expect(wrapper.find("Select")).to.have.length(1);
        });
    });
});