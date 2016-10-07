import * as React from "react";
import * as TestUtils from "react-addons-test-utils";
import { expect } from "chai";
import Content from "./Content";

describe("Content", () => {
    let renderer: React.ShallowRenderer;

    beforeEach(() => {
        renderer = TestUtils.createRenderer();
        renderer.render(<Content />);
    });

    it("should render correctly", () => {
        const result = renderer.getRenderOutput();
        expect(result.type).to.equal("main");
    });
});
