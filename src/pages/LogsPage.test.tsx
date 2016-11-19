import * as chai from "chai";
import { shallow, ShallowWrapper } from "enzyme";
// tslint:disable:no-unused-variable
import * as React from "react"; // Needed for enzyme, unused for some reason.
// tslint:enable:no-unused-variable
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

import Conversation from "../models/conversation";
import Log from "../models/log";
import Output from "../models/output";
import Source from "../models/source";
import browser from "../utils/browser";
import { dummyLogs, dummyOutputs } from "../utils/test";
import { LogsPage } from "./LogsPage";

// Setup chai with sinon-chai
chai.use(sinonChai);
let expect = chai.expect;

describe("Logs Page", function () {

    let browserStub: Sinon.SinonStub;

    afterEach(function() {
        browserStub.restore();
    });

    it("should render correctly", function () {

        browserStub = sinon.stub(browser, "isMobileWidth").returns(true);

        const getLogs = sinon.spy();
        const wrapper = shallow(
            <LogsPage
                logs={undefined}
                getLogs={getLogs}
                source={undefined} />
        );

        expect(wrapper.find("Grid")).to.have.length(1);
        expect(wrapper.find("ConversationList")).to.have.length(1);
    });

    describe("with sources", function () {
        describe("without logs", function () {
            it("should render correctly", function () {

                browserStub = sinon.stub(browser, "isMobileWidth").returns(true);

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

                browserStub = sinon.stub(browser, "isMobileWidth").returns(true);

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
            let wrapper: ShallowWrapper<any, any>; // LogsPageProps and LogsPageState respectively.

            beforeEach(function () {
                browserStub = sinon.stub(browser, "isMobileWidth").returns(true);

                wrapper = shallow(<LogsPage
                    logs={logs}
                    getLogs={getLogs}
                    source={source}
                    params={params} />);
            });

            it("Checks the state is proper after a user click.", function () {
                wrapper.find("ConversationList").simulate("click", convo);

                expect(wrapper.state().request).to.equal(logs[0]);
                expect(wrapper.state().response).to.equal(logs[1]);
                expect(wrapper.state().outputs[0]).to.equal(outputs[0]);
                expect(wrapper.state().outputs[1]).to.equal(outputs[1]);
            });
        });
    });
});