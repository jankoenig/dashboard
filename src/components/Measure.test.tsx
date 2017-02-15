import * as chai from "chai";
import { mount, ReactWrapper, shallow, ShallowWrapper } from "enzyme";
import * as React from "react";
import * as sinon from "sinon";

let jsdom = require("mocha-jsdom");

import browser from "../utils/browser";

import { Measure, MeasureProps } from "./Measure";

let expect = chai.expect;

class TestingWrappedEvent implements browser.WrappedEvent {
    constructor() {
        this.register = sinon.stub();
        this.unregister = sinon.stub();
    }

    register: Sinon.SinonStub;

    unregister: Sinon.SinonStub;

    reset() {
        this.register.reset();
        this.unregister.reset();
    }
}

describe("Measure", function () {

    let onMeasure: Sinon.SinonStub;

    before(function() {
        onMeasure = sinon.stub();
    });

    afterEach(function () {
        onMeasure.reset();
    });

    it("Renders correctly", function () {
        let wrapper: ShallowWrapper<MeasureProps, any> = shallow((
            <Measure onMeasure={onMeasure}>
                <div className="firstComponent" />
                <div className="secondComponent" />
            </Measure>
        ));

        // The top later is a "div"
        expect(wrapper.find("div")).to.have.length(3);
        expect(wrapper.find(".firstComponent")).to.have.length(1);
        expect(wrapper.find(".secondComponent")).to.have.length(1);
    });

    describe("Full Render", function () {

        jsdom();

        let wrappedEvent: TestingWrappedEvent;
        let sizeStub: Sinon.SinonStub;
        let onResizeStub: Sinon.SinonStub;
        let updateDimensions: Sinon.SinonSpy;

        let wrapper: ReactWrapper<any, any>;

        before(function () {
            wrappedEvent = new TestingWrappedEvent();
            sizeStub = sinon.stub(browser, "size").returns({ width: 800, height: 800 });
            onResizeStub = sinon.stub(browser, "onResize").yields({ target: { innerWidth: 200, innerHeight: 800 }}).returns(wrappedEvent);

            updateDimensions = sinon.spy(Measure.prototype, "updateDimensions");
        });

        beforeEach(function() {
            wrapper = mount((
                <Measure onMeasure={onMeasure} />
            ));
        });

        afterEach(function () {
            wrappedEvent.reset();
            sizeStub.reset();
            onResizeStub.reset();
            updateDimensions.reset();
        });

        after(function () {
            sizeStub.restore();
            onResizeStub.restore();
            updateDimensions.restore();
        });

        it("registers an onResize listener", function () {
            expect(onResizeStub).to.have.been.calledOnce;
        });

        it("Calls the onMeasure when the window gets smaller.", function () {
            expect(wrappedEvent.register).to.have.been.calledOnce;
            expect(onMeasure).to.have.been.calledTwice; // Once for mounting and once for event thrown.
            expect(updateDimensions).to.have.been.calledTwice; // Once for mounting and once for event thrown.
        });

        xit("Unregisters on unmount", function () {
            // Unmount throws an error so need to figure out why.
            wrapper.unmount();

            expect(wrappedEvent.unregister).to.have.been.calledOnce;
        });
    });
});