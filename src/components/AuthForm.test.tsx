import * as React from "react";
import * as TestUtils from "react-addons-test-utils";
import { expect } from "chai";

import AuthForm from "./AuthForm";

describe("AuthForm", () => {
    let renderer: React.ShallowRenderer;

    beforeEach(function () {
        renderer = TestUtils.createRenderer();
        renderer.render(<AuthForm onSubmit={ function() { } } />);
    });

    it("should render correctly", function () {
        const result = renderer.getRenderOutput();
        expect(result.type).to.equal("div");
    });
});
