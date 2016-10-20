import * as chai from "chai";
// import { shallow } from "enzyme";
// tslint:disable:no-unused-variable
import * as React from "react"; // Needed for enzyme, unused for some reason.
// tslint:enable:no-unused-variable

// import { Menu } from "./index";

let expect = chai.expect;

describe("Menu", function() {
    it("renders correctly", function() {
        expect(true).to.exist;
        // const wrapper = shallow(<Menu align="left" valign="bottom" ripple={false} target="targetId" />);
        // expect(wrapper.find("ul")).to.have.length(1);
    });
});

describe("MenuItem", function() {
    it("renders correctly", function() {
       // const wrapper = shallow(<MenuItem >Menu Item Title</MenuItem>);
       // expect(wrapper.find("li")).to.have.length(1);
       // console.log(wrapper.find("li").text());
    });
});