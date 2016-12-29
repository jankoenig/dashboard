import * as chai from "chai";
import { shallow, ShallowWrapper } from "enzyme";
// tslint:disable:no-unused-variable
import * as React from "react"; // Needed for enzyme, unused for some reason.
// tslint:enable:no-unused-variable

import Conversation from "../../models/conversation";
import Log from "../../models/log";
import Output from "../../models/output";
import Source from "../../models/source";
import { dummyLogs, dummyOutputs } from "../../utils/test";
import { LogsPage, LogsPageProps } from "./LogsPage";

// Setup chai with sinon-chai
let expect = chai.expect;

describe("Logs Page", function () {
    describe("with source", function () {
        describe("without logs", function () {
            it("should render correctly", function () {
                let logs: Log[] = [];
                let source = new Source({ name: "name" });
                let params = {
                    sourceSlug: "name"
                };
                const wrapper: ShallowWrapper<LogsPageProps, any> = shallow((
                    <LogsPage
                        logs={logs}
                        source={source}
                        params={params} />
                ));

                expect(wrapper.find("JSONTree")).to.have.length(0);
            });
        });

        describe("with logs", function () {
            it("should render correctly", function () {
                let logs: Log[] = dummyLogs(4);
                let source = new Source({ name: "name" });
                let params = {
                    sourceSlug: "name"
                };
                const wrapper: ShallowWrapper<LogsPageProps, any> = shallow((
                    <LogsPage
                        logs={logs}
                        source={source}
                        params={params} />
                ));

                expect(wrapper.find("JSONTree")).to.have.length(0);
            });
        });

        describe("Test interactions", function () {

            let logs: Log[] = dummyLogs(2);
            let outputs: Output[] = dummyOutputs(2);
            let source = new Source({ name: "name" });
            let params = {
                sourceSlug: "name"
            };

            let convo: Conversation = new Conversation({ request: logs[0], response: logs[1], outputs: outputs });
            let wrapper: ShallowWrapper<LogsPageProps, any>;

            beforeEach(function () {
                wrapper = shallow((
                    <LogsPage
                        logs={logs}
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