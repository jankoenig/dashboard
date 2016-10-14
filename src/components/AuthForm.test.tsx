import { expect } from "chai";
import * as React from "react";
import * as TestUtils from "react-addons-test-utils";

import AuthForm from "./AuthForm";

describe("AuthForm", () => {
    let renderer: React.ShallowRenderer;
    let onSubmitAccessed = false;
    let onSubmit = function() {
        onSubmitAccessed = true;
    };

    beforeEach(function () {
        onSubmitAccessed = false;
        renderer = TestUtils.createRenderer();
        renderer.render(<AuthForm onSubmit={ onSubmit } />);
    });

    it("should render correctly", function () {
        const result = renderer.getRenderOutput();
        expect(result.type).to.equal("div");
    });
});
