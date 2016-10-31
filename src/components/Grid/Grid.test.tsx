import * as chai from "chai";
import { shallow } from "enzyme";
// tslint:disable:no-unused-variable
import * as React from "react"; // Needed for enzyme, unused for some reason.
// tslint:enable:no-unused-variable

import Grid from "./Grid";

let expect = chai.expect;

describe("Grid", function() {
  it("should render correctly", function() {
    const wrapper = shallow(<Grid />);
    expect(wrapper.type()).to.equal("div");
    expect(wrapper.props().className).to.contain("mdl-grid");
  });
});
