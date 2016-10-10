import * as React from "react";
import * as TestUtils from "react-addons-test-utils";
import { expect } from "chai";

import Layout from "./Layout";
import Drawer from "./Drawer";

describe("Layout", function() {
    let renderer: React.ShallowRenderer;

    beforeEach(() => {
        renderer = TestUtils.createRenderer();
        renderer.render(<Layout />);
    });

    it("should render correctly", function() {
        const result = renderer.getRenderOutput();
        expect(result.type).to.equal("div");
    });

    it("should not be setup for a drawer", function() {
        const result = renderer.getRenderOutput();
        expect(result.props.className).to.not.contain("mdl-layout--fixed-drawer");
    });

    describe("with children", function() {
        beforeEach(() => {
            renderer = TestUtils.createRenderer();
            renderer.render(
                <Layout>
                    <h2>Header</h2>
                    <Drawer title="Drawer"/>
                </Layout>
            );
        });
        it("should render the children", function() {
          const result = renderer.getRenderOutput();
          expect(result.type).to.equal("div");
          expect(React.Children.toArray(result.props.children).length).to.equal(2);
        });
    });

    describe("with drawer property", function() {
        beforeEach(() => {
            renderer = TestUtils.createRenderer();
            renderer.render(
                <Layout drawer={true} />
            );
        });

        it("should include the class for a drawer", function() {
            const result = renderer.getRenderOutput();
            expect(result.type).to.exist;
            expect(result.props.className).to.contain("mdl-layout--fixed-drawer");
        });
    });
});
