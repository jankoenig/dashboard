import * as chai from "chai";
import { shallow } from "enzyme";
// tslint:disable:no-unused-variable
import * as React from "react"; // Needed for enzyme, unused for some reason.
// tslint:enable:no-unused-variable

import Cell from "./Cell";

let expect = chai.expect;

describe("Cell", function() {
  it("should render correctly", function() {
    const wrapper = shallow(<Cell />);
    expect(wrapper.type()).to.equal("div");
    expect(wrapper.props().className).to.contain("mdl-cell");
  });
});
