import { expect } from "chai";
import * as React from "react";
import * as TestUtils from "react-addons-test-utils";

import Grid from "./Grid";

describe("Grid", function() {
  let renderer: React.ShallowRenderer;

  beforeEach(() => {
      renderer = TestUtils.createRenderer();
      renderer.render(<Grid />);
  });

  it("should render correctly", function() {
    const result = renderer.getRenderOutput();
    expect(result.type).to.equal("div");
    expect(result.props.className).to.contain("md-grid");
  });
});
