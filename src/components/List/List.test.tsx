import * as chai from "chai";
import { mount, shallow, ShallowWrapper } from "enzyme";
import * as React from "react";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

let jsdom = require("mocha-jsdom");

import List, { ListProps } from "./List";

chai.use(sinonChai);
let expect = chai.expect;

describe("List", function() {

    describe("Full render", function() {

        jsdom();

        let itemRenderer: Sinon.SinonStub;

        beforeEach(function() {
            itemRenderer = sinon.stub().returns((<div className="listItem"/>));
        });

        // List right now is essentially a wrapper for ReactList. ReactList calls each twice which is in error (or maybe not).
        // Either way, the problem is in the library and not in the test, but this test is staying for reference for when it's fixed.
        xit ("Tests the items render.", function () {
            let wrapper = mount(<List itemRenderer={itemRenderer} type="simple" length={5} />);

            expect(itemRenderer).to.have.callCount(5);
            expect(wrapper.find(".listItem")).to.have.length(5);
        });
    });

    describe("Shallow Render", function() {
        let itemRenderer: Sinon.SinonStub;
        let wrapper: ShallowWrapper<ListProps, any>;

        beforeEach(function() {
            wrapper = shallow(<List itemRenderer={itemRenderer} type="simple" length={5} />);
        });

        beforeEach(function() {
            itemRenderer = sinon.stub().returns((<div className="listItem"/>));
        });

        it ("Renders properly", function() {
            expect(wrapper.find("Measure")).to.have.length(1);
            expect(wrapper.find("ReactList")).to.have.length(1);
        });

        it ("Adjust size based on Measure.", function() {
            wrapper.find("Measure").simulate("measure", { width: 200, height: 300 });

            let dimensions = wrapper.state("dimens");

            expect(dimensions.width).to.equal(200);
            expect(dimensions.height).to.equal(300);

            let listWrapper = wrapper.find("div");
            let style = listWrapper.props().style;

            expect(style.height).to.equal(300);
        });
    });
});