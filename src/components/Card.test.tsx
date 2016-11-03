import * as chai from "chai";
import { shallow } from "enzyme";
// tslint:disable:no-unused-variable
import * as React from "react"; // Needed for enzyme, unused for some reason.
// tslint:enable:no-unused-variable

import Card from "./Card";

let expect = chai.expect;

describe("Card", function() {
    it("should render correctly", function () {
        const wrapper = shallow(<Card />);
        expect(wrapper.type()).to.equal("div");
    });
});
