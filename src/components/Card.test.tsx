import { expect } from "chai";
import * as React from "react";
import * as TestUtils from "react-addons-test-utils";

import Card from "./Card";

describe("Card", () => {
    let renderer: React.ShallowRenderer;

    beforeEach(function () {
        renderer = TestUtils.createRenderer();
        renderer.render(<Card />);
    });

    it("should render correctly", function () {
        const result = renderer.getRenderOutput();
        expect(result.type).to.equal("div");
    });
});
