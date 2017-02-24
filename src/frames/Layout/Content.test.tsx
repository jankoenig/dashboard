import * as chai from "chai";
import { shallow } from "enzyme";
import * as React from "react";

import Content from "./Content";

let expect = chai.expect;

describe("Content", () => {
    it("should render correctly", function () {
        const wrapper = shallow(<Content />);
        expect(wrapper.type()).to.equal("main");
    });
});