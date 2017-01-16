import * as chai from "chai";
import { shallow } from "enzyme";
import * as React from "react";

import Card from "./Card";

let expect = chai.expect;

describe("Card", function() {
    it("should render correctly", function () {
        const wrapper = shallow(<Card />);
        expect(wrapper.type()).to.equal("div");
    });
});
