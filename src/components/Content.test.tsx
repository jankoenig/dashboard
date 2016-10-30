import * as chai from "chai";
import { shallow } from "enzyme";
// tslint:disable:no-unused-variable
import * as React from "react"; // Needed for enzyme, unused for some reason.
// tslint:enable:no-unused-variable

import Content from "./Content";

let expect = chai.expect;

describe("Content", () => {
    it("should render correctly", function () {
        const wrapper = shallow(<Content />);
        expect(wrapper.type()).to.equal("main");
    });
});