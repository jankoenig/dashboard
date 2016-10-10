import * as React from "react";
import * as TestUtils from "react-addons-test-utils";
import { expect } from "chai";

import AuthForm from "./AuthForm";

describe("AuthForm", () => {
    let renderer: React.ShallowRenderer;

    beforeEach(function () {
        renderer = TestUtils.createRenderer();
        renderer.render(<AuthForm />);
    });

    it("should render correctly", function () {
        const result = renderer.getRenderOutput();
        expect(result.type).to.equal("div");
    });

    describe("with signup", function () {
        beforeEach(function () {
            renderer = TestUtils.createRenderer();
            renderer.render(<AuthForm signup={true} />);
        });
        it("should include the verify password input", function () {
            const result = renderer.getRenderOutput();

            for (let child of React.Children.toArray(result.props.children)) {

                let childElement: React.ReactElement<any> = child as React.ReactElement<any>;

                if (childElement.type === "form") {
                    // The 'form' child should have three children
                    expect(childElement.props.children.length).to.equal(3);
                }
            }
        });
    });
});
