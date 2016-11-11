import * as chai from "chai";
import { shallow } from "enzyme";
// tslint:disable:no-unused-variable
import * as React from "react"; // Needed for enzyme, unused for some reason.
// tslint:enable:no-unused-variable
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

import Log from "../models/log";
import Source from "../models/source";
import { dummyLogs } from "../utils/test";
import { LogsPage } from "./LogsPage";

// Setup chai with sinon-chai
chai.use(sinonChai);
let expect = chai.expect;

describe("Logs Page", function () {
    it("should render correctly", function () {
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
    });
});