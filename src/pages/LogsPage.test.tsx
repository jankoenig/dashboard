import * as chai from "chai";
import { mount, shallow, ShallowWrapper } from "enzyme";
// tslint:disable:no-unused-variable
import * as React from "react"; // Needed for enzyme, unused for some reason.
// tslint:enable:no-unused-variable
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";
let jsdom = require("mocha-jsdom");

import Conversation from "../models/conversation";
import Log from "../models/log";
import Output from "../models/output";
import Source from "../models/source";
import browser from "../utils/browser";
import { dummyLogs, dummyOutputs } from "../utils/test";
import { LogsPage, LogsPageProps } from "./LogsPage";

// Setup chai with sinon-chai
chai.use(sinonChai);
let expect = chai.expect;

class TestingWrappedEvent implements browser.WrappedEvent {
    register() {

    }
    unregister() {

    }
}

describe("Logs Page", function () {

    jsdom();

    describe("componentDidMount", function () {

        it("registers an onResize listener", function () {

            let onResize = sinon.spy(browser, "onResize");
            let getLogs = sinon.spy();
            mount(
                <LogsPage
                    logs={undefined}
                    getLogs={getLogs}
                    source={undefined} />
            );

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

            let updateDimensions = sinon.spy(LogsPage.prototype, "updateDimensions");
            let getLogs = sinon.spy();

            mount(
                <LogsPage
                    logs={undefined}
                    getLogs={getLogs}
                    source={undefined} />
            );

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

            let updateDimensions = sinon.spy(LogsPage.prototype, "updateDimensions");
            let getLogs = sinon.spy();
            mount(
                <LogsPage
                    logs={undefined}
                    getLogs={getLogs}
                    source={undefined} />
            );

            expect(wrappedEvent.register).to.have.been.calledOnce;
            expect(updateDimensions).to.have.been.calledTwice;

            sizeStub.restore();
            onResizeStub.restore();
            updateDimensions.restore();
        });
    });

    describe("without source", function () {

        // Set up some stubs
        let isMobileWidthStub: Sinon.SinonStub;
        let onResizeStub: Sinon.SinonStub;
        let sizeStub: Sinon.SinonStub;

        let getLogs: Sinon.SinonSpy;
        let wrapper: ShallowWrapper<LogsPageProps, any>;

        beforeEach(function () {

            isMobileWidthStub = sinon.stub(browser, "isMobileWidth").returns(true);
            onResizeStub = sinon.stub(browser, "onResize");
            sizeStub = sinon.stub(browser, "size").returns({ width: 800, height: 800 });

            getLogs = sinon.spy();
            wrapper = shallow(
                <LogsPage
                    logs={undefined}
                    getLogs={getLogs}
                    source={undefined} />
            );
        });

        afterEach(function () {
            // and restore them after each test
            isMobileWidthStub.restore();
            onResizeStub.restore();
            sizeStub.restore();
        });

        it("should render correctly", function () {
            expect(wrapper.find("Grid")).to.have.length(1);
            expect(wrapper.find("ConversationListView")).to.have.length(1);
        });

        describe("componentWillReceiveProps", function () {
            it("sets the source and requests logs", function () {
                wrapper.setProps({
                    source: new Source({ name: "name" }),
                    logs: [],
                    getLogs: getLogs
                });

                expect(getLogs).to.have.been.calledOnce;
            });
        });
    });

    describe("with source", function () {

        // Set up some stubs
        let isMobileWidthStub: Sinon.SinonStub;
        let onResizeStub: Sinon.SinonStub;
        let sizeStub: Sinon.SinonStub;

        afterEach(function () {
            // and restore them after each test
            isMobileWidthStub.restore();
            onResizeStub.restore();
            sizeStub.restore();
        });

        describe("without logs", function () {
            it("should render correctly", function () {

                isMobileWidthStub = sinon.stub(browser, "isMobileWidth").returns(true);
                onResizeStub = sinon.stub(browser, "onResize");
                sizeStub = sinon.stub(browser, "size").returns({ width: 800, height: 800 });

                const getLogs = sinon.spy();
                let logs: Log[] = [];
                let source = new Source({ name: "name" });
                let params = {
                    sourceSlug: "name"
                };
                const wrapper = shallow(
                    <LogsPage
                        logs={logs}
                        getLogs={getLogs}
                        source={source}
                        params={params} />
                );

                expect(wrapper.find("JSONTree")).to.have.length(0);
            });
        });

        describe("with logs", function () {
            it("should render correctly", function () {

                isMobileWidthStub = sinon.stub(browser, "isMobileWidth").returns(true);
                onResizeStub = sinon.stub(browser, "onResize");
                sizeStub = sinon.stub(browser, "size").returns({ width: 800, height: 800 });

                const getLogs = sinon.spy();
                let logs: Log[] = dummyLogs(4);
                let source = new Source({ name: "name" });
                let params = {
                    sourceSlug: "name"
                };
                const wrapper = shallow(
                    <LogsPage
                        logs={logs}
                        getLogs={getLogs}
                        source={source}
                        params={params} />
                );

                expect(wrapper.find("JSONTree")).to.have.length(0);
            });
        });

        describe("Test interactions", function () {

            const getLogs = sinon.spy();
            let logs: Log[] = dummyLogs(2);
            let outputs: Output[] = dummyOutputs(2);
            let source = new Source({ name: "name" });
            let params = {
                sourceSlug: "name"
            };

            let convo: Conversation = new Conversation({ request: logs[0], response: logs[1], outputs: outputs });
            let wrapper: ShallowWrapper<LogsPageProps, any>;

            beforeEach(function () {
                isMobileWidthStub = sinon.stub(browser, "isMobileWidth").returns(true);
                onResizeStub = sinon.stub(browser, "onResize");
                sizeStub = sinon.stub(browser, "size").returns({ width: 800, height: 800 });

                wrapper = shallow(<LogsPage
                    logs={logs}
                    getLogs={getLogs}
                    source={source}
                    params={params} />);
            });
            it("Checks the state is proper after a user click.", function () {
                wrapper.find("ConversationListView").simulate("click", convo);

                expect(wrapper.state().request).to.equal(logs[0]);
                expect(wrapper.state().response).to.equal(logs[1]);
                expect(wrapper.state().outputs[0]).to.equal(outputs[0]);
                expect(wrapper.state().outputs[1]).to.equal(outputs[1]);
            });
        });
    });
});