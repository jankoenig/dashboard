import * as chai from "chai";
import { shallow, ShallowWrapper } from "enzyme";
import * as React from "react";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

import Conversation, { createConvo } from "../../../models/conversation";
import Log from "../../../models/log";
import LogQuery from "../../../models/log-query";
import Output from "../../../models/output";
import Source from "../../../models/source";
import { LogMap } from "../../../reducers/log";
import browser from "../../../utils/browser";
import Interval from "../../../utils/Interval";
import { dummyLogs, dummyOutputs } from "../../../utils/test";
import LogsExplorer from "./LogsExplorer";

// Setup chai with sinon-chai
chai.use(sinonChai);
let expect = chai.expect;

describe("LogExplorer", function () {

    describe("without properties", function () {
        let wrapper = shallow(<LogsExplorer source={undefined} logMap={undefined} />);

        it("renders a FilterBar", function () {
            expect(wrapper.find("FilterBar")).to.have.length(1);
        });

        it("does not render an Interaction", function () {
            expect(wrapper.find("Interaction")).to.have.length(0);
        });
    });

    describe("with properties", function () {
        let logs: Log[] = dummyLogs(4);
        let outputs: Output[] = dummyOutputs(2);
        let source = new Source({ name: "name", id: "id" });
        let source2 = new Source({ name: "name", id: "id2" });
        let logQuery: LogQuery = new LogQuery({ startTime: new Date(), endTime: new Date(), source: source });
        let logMap: LogMap = { id: { logs: logs, query: logQuery } };
        let convo: Conversation = createConvo({ request: logs[0], response: logs[1], outputs: outputs });

        let onRefresh: Sinon.SinonStub;

        let wrapper: ShallowWrapper<any, any>;

        before(function() {
            onRefresh = sinon.stub();
        });

        beforeEach(function () {
            onRefresh.reset();
            wrapper = shallow(<LogsExplorer source={source} logMap={logMap} onGetNewLogs={onRefresh} />);
        });

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
                expect(wrapper.state("selectedConvo").request).to.equal(logs[0]);
            });

            it("sets the correct response", function () {
                expect(wrapper.state("selectedConvo").response).to.equal(logs[1]);
            });

            it("sets the log outputs", function () {
                expect(wrapper.state("selectedConvo").outputs[0]).to.equal(outputs[0]);
                expect(wrapper.state("selectedConvo").outputs[1]).to.equal(outputs[1]);
            });

            it("clears conversation on new source in props.", function () {
                wrapper.setProps({
                    source: source2,
                    logMap: logMap
                });

                expect(wrapper.state("selectedConvo")).to.be.undefined;
            });

            it("clears conversation on undefined source in props.", function () {
                wrapper.setProps({
                    source: undefined,
                    logMap: logMap
                });

                expect(wrapper.state("selectedConvo")).to.be.undefined;
            });

            it("does not clear conversation when new props contains same source.", function () {
                wrapper.setProps({
                    source: source,
                    logMap: logMap
                });

                expect(wrapper.state("selectedConvo")).to.exist;
            });
        });

        describe("Tests the refreshing.", function() {

            let stubExecutor: StubExecutor;
            let intervalStub: Sinon.SinonStub;

            before(function() {
                intervalStub = sinon.stub(Interval, "newExecutor", (ms: number, callback: () => void): Interval.Executor => {
                    return stubExecutor = new StubExecutor(ms, callback);
                });
            });

            afterEach(function() {
                stubExecutor.reset();
                intervalStub.reset();
            });

            after(function() {
                intervalStub.reset();
            });

            it ("Tests there is a value and callback passed to the exectuor.", function() {
                expect(stubExecutor).to.exist;
                expect(stubExecutor.ms).to.be.greaterThan(0);
                expect(stubExecutor.callback).to.exist;
            });

            it ("Tests the interval executor is started by default.", function() {
                expect(stubExecutor.start).to.have.been.calledOnce;
            });

            it ("Tests the interval executor is ended when unmounted.", function() {
                wrapper.unmount();
                expect(stubExecutor.end).to.have.been.calledOnce;
            });

            it ("Tests the callback when the executor executes the callback.", function() {
                stubExecutor.callback();
                expect(onRefresh).to.have.been.calledOnce;
            });
        });
    });
});

class StubExecutor implements Interval.Executor {

    callback: () => void;
    ms: number;

    start: Sinon.SinonStub;
    end: Sinon.SinonStub;

    constructor(ms: number, callback: () => void) {
        this.callback = callback;
        this.ms = ms;
        this.start = sinon.stub();
        this.end = sinon.stub();
    }

    reset() {
        this.start.reset();
        this.end.reset();
    }
}