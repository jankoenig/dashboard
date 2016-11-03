import * as chai from "chai";
import { shallow } from "enzyme";
// tslint:disable:no-unused-variable
import * as React from "react"; // Needed for enzyme, unused for some reason.
// tslint:enable:no-unused-variable

import Drawer from "./Drawer";

let expect = chai.expect;

describe("Drawer", function() {
    it("should render correctly", function() {
        const wrapper = shallow(<Drawer />);
        expect(wrapper.type()).to.equal("div");
        expect(wrapper.find("header")).to.have.length(0);
    });
    describe("with title", function() {
        it("should render a header", function() {
            const wrapper = shallow(<Drawer title={"title"}/>);
            expect(wrapper.find("header")).to.have.length(1);
        });
    });
});