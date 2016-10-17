import { expect } from "chai";
import * as React from "react";
import * as TestUtils from "react-addons-test-utils";

import Cell from "./Cell";

describe("Cell", function() {
  let renderer: React.ShallowRenderer;

  beforeEach(() => {
      renderer = TestUtils.createRenderer();
      renderer.render(<Cell />);
  });

  it("should render correctly", function() {
    const result = renderer.getRenderOutput();
    expect(result.type).to.equal("div");
    expect(result.props.className).to.contain("mdl-cell");
  });
});
