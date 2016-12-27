import * as chai from "chai";
import { shallow, ShallowWrapper } from "enzyme";
import * as React from "react";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

import Conversation from "../../models/conversation";
import Log from "../../models/log";
import LogQuery from "../../models/log-query";
import Output from "../../models/output";
import Source from "../../models/source";
import { LogMap } from "../../reducers/log";
import browser from "../../utils/browser";
import { dummyLogs, dummyOutputs } from "../../utils/test";
import { LogsPage, LogsPageProps } from "./LogsPage";

// Setup chai with sinon-chai
chai.use(sinonChai);
let expect = chai.expect;


describe("Logs Page", function () {

    let wrapper = shallow(<LogsPage source={undefined} logMap={undefined} />);
    it("renders a LogExplorer", function() {
        expect(wrapper.find("LogExplorer")).to.have.length(1);
    });

    describe("without source", function () {

        // Set up some stubs
        let isMobileWidthStub: Sinon.SinonStub;
        let onResizeStub: Sinon.SinonStub;
        let sizeStub: Sinon.SinonStub;

        let wrapper: ShallowWrapper<LogsPageProps, any>;

        beforeEach(function () {

            isMobileWidthStub = sinon.stub(browser, "isMobileWidth").returns(true);
            onResizeStub = sinon.stub(browser, "onResize");
            sizeStub = sinon.stub(browser, "size").returns({ width: 800, height: 800 });

            wrapper = shallow((
                <LogsPage
                    logMap={undefined}
                    source={undefined} />
            ));
        });

        afterEach(function () {
            // and restore them after each test
            isMobileWidthStub.restore();
            onResizeStub.restore();
            sizeStub.restore();
        });

        it("should render correctly", function () {
            expect(wrapper.find("Grid")).to.have.length(1);
            expect(wrapper.find("FilterableConversationList")).to.have.length(1);
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

                let source = new Source({ name: "name", id: "id" });
                let logQuery: LogQuery = new LogQuery({ startTime: new Date(), endTime: new Date(), source: source });
                let logMap: LogMap = { id: { logs: [], query: logQuery}};
                let params = {
                    sourceSlug: "name"
                };
                const wrapper = shallow((
                    <LogsPage
                        logMap={logMap}
                        source={source}
                        params={params} />
                ));

                expect(wrapper.find("JSONTree")).to.have.length(0);
            });
        });

        describe("Test interactions", function () {

            let logs: Log[] = dummyLogs(2);
            let outputs: Output[] = dummyOutputs(2);
            let source = new Source({ name: "name", id: "id" });
            let logQuery: LogQuery = new LogQuery({ startTime: new Date(), endTime: new Date(), source: source });
            let logMap: LogMap = { id: { logs: logs, query: logQuery}};
            let params = {
                sourceSlug: "name"
            };

            let convo: Conversation = new Conversation({ request: logs[0], response: logs[1], outputs: outputs });
            let wrapper: ShallowWrapper<LogsPageProps, any>;

            beforeEach(function () {
                isMobileWidthStub = sinon.stub(browser, "isMobileWidth").returns(true);
                onResizeStub = sinon.stub(browser, "onResize");
                sizeStub = sinon.stub(browser, "size").returns({ width: 800, height: 800 });

                wrapper = shallow((
                    <LogsPage
                        logMap={logMap}
                        source={source}
                        params={params} />
                ));
            });
            it("Checks the state is proper after a user click.", function () {
                wrapper.find("FilterableConversationList").simulate("showConversation", convo);

                expect(wrapper.state().request).to.equal(logs[0]);
                expect(wrapper.state().response).to.equal(logs[1]);
                expect(wrapper.state().outputs[0]).to.equal(outputs[0]);
                expect(wrapper.state().outputs[1]).to.equal(outputs[1]);
            });
        });
    });
});