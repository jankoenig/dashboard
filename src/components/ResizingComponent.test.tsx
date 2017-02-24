import * as chai from "chai";
import { shallow, ShallowWrapper } from "enzyme";
import * as React from "react";

import Measure from "./Measure";
import Resizing from "./ResizingComponent";

let expect = chai.expect;

describe("ResizingComponent", function () {

    describe("Rendering", function () {
        let wrapper: ShallowWrapper<any, any>;

        before(function () {
            wrapper = shallow(
                <Resizing>
                    <div className="testComp">text</div>
                    <div className="testComp">text</div>
                    <div className="testComp">text</div>
                    <div className="testComp">text</div>
                </Resizing>);
        });

        it("renders correctly", function () {
            const firstChild = wrapper.childAt(0);
            expect(firstChild.find(".testComp")).to.have.length(4);
        });

        it("Uses correct default style.", function () {
            expect(Resizing.defaultProps.overflowY).to.equal("auto");
        });

        it("Passes the correct default style to it's first child.", function () {
            const firstChild = wrapper.childAt(0);
            expect(firstChild).to.have.style("overflow-y", "auto");
        });
    });

    describe("Updating", function () {
        let wrapper: ShallowWrapper<any, any>;

        beforeEach(function () {
            wrapper = shallow(
                <Resizing>
                    <div className="testComp">text</div>
                    <div className="testComp">text</div>
                    <div className="testComp">text</div>
                    <div className="testComp">text</div>
                </Resizing>);
        });

        it ("Tests the proper style is applied on size update.", function() {
            const measure = wrapper.find(Measure).at(0);
            measure.simulate("measure", { width: 100, height: 200 });

            const firstChild = wrapper.childAt(0);
            expect(firstChild).to.have.style("overflow-y", "auto");
            expect(firstChild).to.have.style("max-height", "200px");
        });

        it ("Updates appropriately with new overflowY props.", function() {
            wrapper.setProps({ overflowY: "hidden" });
            const firstChild = wrapper.childAt(0);
            expect(firstChild).to.have.style("overflow-y", "hidden");
        });
    });
});