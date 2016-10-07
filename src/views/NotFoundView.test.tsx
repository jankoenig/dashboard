import * as React from "react";
import * as TestUtils from "react-addons-test-utils";
import { expect } from "chai";
import NotFoundView from "./NotFoundView";

describe("NotFoundView", () => {
    let renderer: React.ShallowRenderer;

    beforeEach(() => {
        renderer = TestUtils.createRenderer();
        renderer.render(<NotFoundView />);
    });

    it("should render correctly", () => {
        const result = renderer.getRenderOutput();
        expect(result.type).to.equal("div");
    });
});
