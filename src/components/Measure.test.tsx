import * as chai from "chai";
import { mount, shallow, ShallowWrapper } from "enzyme";
// tslint:disable:no-unused-variable
import * as React from "react"; // Needed for enzyme, unused for some reason.
// tslint:enable:no-unused-variable
import * as sinon from "sinon";

let jsdom = require("mocha-jsdom");

import browser from "../utils/browser";

import { Measure, MeasureProps } from "./Measure";

let expect = chai.expect;

class TestingWrappedEvent implements browser.WrappedEvent {
    register() {

    }
    unregister() {

    }
}

describe("Measure", function () {

    let onMeasure: Sinon.SinonStub;

    beforeEach(function () {
        onMeasure = sinon.stub();
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

    describe("Full Render", function() {

        jsdom();

        it("registers an onResize listener", function () {

            let onResize = sinon.spy(browser, "onResize");
            mount((
                <Measure onMeasure={onMeasure} />
            ));

            expect(onResize).to.have.been.calledOnce;

            onResize.restore();
        });


        it("Calls the onMeasure when the window gets smaller.", function () {
            // No need for this to do anything as they won't be called. The resizeStub throws the event to the callback.
            let wrappedEvent: browser.WrappedEvent = new TestingWrappedEvent();
            wrappedEvent.register = sinon.stub();
            wrappedEvent.unregister = sinon.stub();

            // Utils stubs.  Not testing these so do whatever.
            let sizeStub = sinon.stub(browser, "size").returns({ width: 800, height: 800 });
            let onResizeStub = sinon.stub(browser, "onResize")
                .yields({ target: { innerWidth: 200, innerHeight: 800 } })
                .returns(wrappedEvent);

            let updateDimensions = sinon.spy(Measure.prototype, "updateDimensions");

            mount((
                <Measure onMeasure={onMeasure} />
            ));

            expect(wrappedEvent.register).to.have.been.calledOnce;
            expect(onMeasure).to.have.been.calledTwice; // Once for mounting and once for event thrown.
            expect(updateDimensions).to.have.been.calledTwice; // Once for mounting and once for event thrown.

            sizeStub.restore();
            onResizeStub.restore();
            updateDimensions.restore();
        });

        it("Calls the onMeasure when the window gets smaller.", function () {
            // No need for this to do anything as they won't be called. The resizeStub throws the event to the callback.
            let wrappedEvent: browser.WrappedEvent = new TestingWrappedEvent();
            wrappedEvent.register = sinon.stub();
            wrappedEvent.unregister = sinon.stub();

            // Utils stubs.  Not testing these so do whatever.
            let sizeStub = sinon.stub(browser, "size").returns({ width: 200, height: 800 });
            let onResizeStub = sinon.stub(browser, "onResize")
                .yields({ target: { innerWidth: 800, innerHeight: 800 } })
                .returns(wrappedEvent);

            let updateDimensions = sinon.spy(Measure.prototype, "updateDimensions");

            mount((
                <Measure onMeasure={onMeasure} />
            ));

            expect(wrappedEvent.register).to.have.been.calledOnce;
            expect(onMeasure).to.have.been.calledTwice; // Once for mounting and once for event thrown.
            expect(updateDimensions).to.have.been.calledTwice; // Once for mounting and once for event thrown.

            sizeStub.restore();
            onResizeStub.restore();
            updateDimensions.restore();
        });
    });
});