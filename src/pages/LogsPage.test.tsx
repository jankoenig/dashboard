import * as chai from "chai";
import { shallow } from "enzyme";
// tslint:disable:no-unused-variable
import * as React from "react"; // Needed for enzyme, unused for some reason.
// tslint:enable:no-unused-variable
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

import Log from "../models/log";
import Source from "../models/source";
import { mockLogs } from "../utils/test";
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
                sources={[]} />
        );

        expect(wrapper.type()).to.equal("div");
        let p = wrapper.find("p");
        expect(p.text()).to.eql("Loading logs...");
    });
    describe("with sources", function () {
        describe("without logs", function () {
            it("should render correctly", function () {
                const getLogs = sinon.spy();
                let logs: Log[] = [];
                let source = new Source({ name: "name" });
                let sources = [source];
                let params = {
                    sourceSlug: "name"
                };
                const wrapper = shallow(
                    <LogsPage
                        logs={logs}
                        getLogs={getLogs}
                        sources={sources}
                        params={params} />
                );

                expect(wrapper.find("p")).to.have.length(1);
                let p = wrapper.find("p");
                expect(p.text()).to.eql("You don't have any logs yet.");
            });
        });
        describe("with logs", function () {
            it("should render correctly", function () {
                const getLogs = sinon.spy();
                let logs: Log[] = mockLogs(3);
                let source = new Source({ name: "name" });
                let sources = [source];
                let params = {
                    sourceSlug: "name"
                };
                const wrapper = shallow(
                    <LogsPage
                        logs={logs}
                        getLogs={getLogs}
                        sources={sources}
                        params={params} />
                );

                expect(wrapper.find("JSONTree")).to.have.length(1);
                let h3 = wrapper.find("h3");
                expect(h3.text()).to.eql("name");
            });
        });
    });
});