import * as chai from "chai";
import { shallow } from "enzyme";
import * as React from "react";

import Cell from "./Cell";

let expect = chai.expect;

describe("Cell", function() {
  it("should render correctly", function() {
    const wrapper = shallow(<Cell />);
    expect(wrapper.type()).to.equal("div");
    expect(wrapper.props().className).to.contain("mdl-cell");
  });
});
