import { expect } from "chai";
import * as React from "react";
import * as TestUtils from "react-addons-test-utils";

import NotFoundPage from "./NotFoundPage";

describe("NotFoundView", () => {
    let renderer: React.ShallowRenderer;

    beforeEach(() => {
        renderer = TestUtils.createRenderer();
        renderer.render(<NotFoundPage />);
    });

    it("should render correctly", () => {
        const result = renderer.getRenderOutput();
        expect(result.type).to.equal("div");
    });
});
