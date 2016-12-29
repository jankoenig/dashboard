import * as chai from "chai";
import { mount, shallow } from "enzyme";
import * as React from "react";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";
let jsdom = require("mocha-jsdom");

import Conversation from "../../models/conversation";
import Log from "../../models/log";
import LogQuery from "../../models/log-query";
import Output from "../../models/output";
import Source from "../../models/source";
import { LogMap } from "../../reducers/log";
import browser from "../../utils/browser";
import { dummyLogs, dummyOutputs } from "../../utils/test";
import LogExplorer from "./LogExplorer";

// Setup chai with sinon-chai
chai.use(sinonChai);
let expect = chai.expect;

class TestingWrappedEvent implements browser.WrappedEvent {
    register() {

    }
    unregister() {

    }
}

describe("LogExplorer", function () {
    describe("without properties", function () {
        let wrapper = shallow(<LogExplorer source={undefined} logMap={undefined} />);
        it("does not render a FilterBar", function () {
            expect(wrapper.find("FilterBar")).to.have.length(0);
        });
        it("does not render an Interaction", function () {
            expect(wrapper.find("Interaction")).to.have.length(0);
        });
    });
    describe("with properties", function () {
        let logs: Log[] = dummyLogs(4);
        let outputs: Output[] = dummyOutputs(2);
        let source = new Source({ name: "name", id: "id" });
        let logQuery: LogQuery = new LogQuery({ startTime: new Date(), endTime: new Date(), source: source });
        let logMap: LogMap = { id: { logs: logs, query: logQuery } };
        let convo: Conversation = new Conversation({ request: logs[0], response: logs[1], outputs: outputs });

        let wrapper = shallow(<LogExplorer source={source} logMap={logMap} />);

        it("renders a FilterBar", function () {
            expect(wrapper.find("FilterBar")).to.have.length(1);
        });
        describe("without a conversation selected", function () {
            it("does not render an Interaction", function () {
                expect(wrapper.find("Interaction")).to.have.length(0);
            });
        });
        describe("with a conversation selected", function () {

            // Set up some stubs
            let isMobileWidthStub: Sinon.SinonStub;
            let onResizeStub: Sinon.SinonStub;
            let sizeStub: Sinon.SinonStub;

            beforeEach(function () {
                isMobileWidthStub = sinon.stub(browser, "isMobileWidth").returns(true);
                onResizeStub = sinon.stub(browser, "onResize");
                sizeStub = sinon.stub(browser, "size").returns({ width: 800, height: 800 });

                // click
                wrapper.find("FilterableConversationList").simulate("showConversation", convo);
            });

            afterEach(function () {
                // and restore them after each test
                isMobileWidthStub.restore();
                onResizeStub.restore();
                sizeStub.restore();
            });
            it("sets the correct request", function () {
                expect(wrapper.state().request).to.equal(logs[0]);
            });
            it("sets the correct response", function () {
                expect(wrapper.state().response).to.equal(logs[1]);
            });
            it("sets the log outputs", function () {
                expect(wrapper.state().outputs[0]).to.equal(outputs[0]);
                expect(wrapper.state().outputs[1]).to.equal(outputs[1]);
            });
        });
    });
});
describe("componentDidMount", function () {

    jsdom();

    it("registers an onResize listener", function () {

        let onResize = sinon.spy(browser, "onResize");
        mount((
            <LogExplorer
                logMap={undefined}
                source={undefined} />
        ));

        expect(onResize).to.have.been.calledOnce;

        onResize.restore();
    });
    it("when window gets smaller it forces an update", function () {
        // No need for this to do anything as they won't be called. The resizeStub throws the event to the callback.
        let wrappedEvent: browser.WrappedEvent = new TestingWrappedEvent();
        wrappedEvent.register = sinon.stub();
        wrappedEvent.unregister = sinon.stub();

        // Utils stubs.  Not testing these so do whatever.
        let sizeStub = sinon.stub(browser, "size").returns({ width: 800, height: 800 });
        let onResizeStub = sinon.stub(browser, "onResize")
            .yields({ target: { innerWidth: 200, innerHeight: 800 } })
            .returns(wrappedEvent);

        let updateDimensions = sinon.spy(LogExplorer.prototype, "updateDimensions");

        mount((
            <LogExplorer
                logMap={undefined}
                source={undefined} />
        ));

        expect(wrappedEvent.register).to.have.been.calledOnce;
        expect(updateDimensions).to.have.been.calledTwice; // Once for mounting and once for event thrown.

        sizeStub.restore();
        onResizeStub.restore();
        updateDimensions.restore();
    });
    it("when window gets larger it forces an update", function () {
        // No need for this to do anything as they won't be called. The resizeStub throws the event to the callback.
        let wrappedEvent: browser.WrappedEvent = new TestingWrappedEvent();
        wrappedEvent.register = sinon.stub();
        wrappedEvent.unregister = sinon.stub();

        // Utils stubs.  Not testing these so do whatever.
        let sizeStub = sinon.stub(browser, "size").returns({ width: 200, height: 800 });
        let onResizeStub = sinon.stub(browser, "onResize")
            .yields({ target: { innerWidth: 800, innerHeight: 800 } })
            .returns(wrappedEvent);

        let updateDimensions = sinon.spy(LogExplorer.prototype, "updateDimensions");

        mount((
            <LogExplorer
                logMap={undefined}
                source={undefined} />
        ));

        expect(wrappedEvent.register).to.have.been.calledOnce;
        expect(updateDimensions).to.have.been.calledTwice;

        sizeStub.restore();
        onResizeStub.restore();
        updateDimensions.restore();
    });
});