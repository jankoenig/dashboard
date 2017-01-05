import * as chai from "chai";
import { shallow } from "enzyme";
import * as React from "react";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

import Conversation from "../../../models/conversation";
import Log from "../../../models/log";
import LogQuery from "../../../models/log-query";
import Output from "../../../models/output";
import Source from "../../../models/source";
import { LogMap } from "../../../reducers/log";
import browser from "../../../utils/browser";
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
        let logQuery: LogQuery = new LogQuery({ startTime: new Date(), endTime: new Date(), source: source });
        let logMap: LogMap = { id: { logs: logs, query: logQuery } };
        let convo: Conversation = new Conversation({ request: logs[0], response: logs[1], outputs: outputs });

        let wrapper = shallow(<LogsExplorer source={source} logMap={logMap} />);

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

            it("clears conversation on new props.", function () {
                wrapper.setProps({
                    source: source,
                    logMap: logMap
                });

                expect(wrapper.state("selectedConvo")).to.be.undefined;
            });
        });
    });
});