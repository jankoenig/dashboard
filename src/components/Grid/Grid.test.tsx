import * as chai from "chai";
import { shallow } from "enzyme";
import * as React from "react";

import Grid from "./Grid";

let expect = chai.expect;

describe("Grid", function() {
  it("should render correctly", function() {
    const wrapper = shallow(<Grid />);
    expect(wrapper.type()).to.equal("div");
    expect(wrapper.props().className).to.contain("mdl-grid");
  });
});
