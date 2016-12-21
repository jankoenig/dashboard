import * as chai from "chai";
import { shallow } from "enzyme";
import * as React from "react";

import LogQuery from "../models/log-query";
import { dummyLogs, dummySources } from "../utils/test";
import { SourcePage } from "./SourcePage";

let expect = chai.expect;

describe("Source Page", function () {
    let logs = dummyLogs(10);
    let source = dummySources(1)[0];
    let query = new LogQuery({
        source: source,
        startTime: new Date(),
        endTime: new Date()
    });
    let logMap = {
        [source.id]: {
            logs: logs,
            query: query
        }
    };
    describe("with source", function () {
        const wrapper = shallow((
            <SourcePage source={source} logMap={logMap} />
        ));

        it("renders correctly", function () {
            expect(wrapper.find("FormInput")).to.have.length(4);
            expect(wrapper.find("SourceSummaryView")).to.have.length(1);
        });
    });
    describe("without source", function () {
        const wrapper = shallow((
            <SourcePage source={undefined} logMap={logMap} />
        ));

        it("renders correctly", function () {
            expect(wrapper.find("FormInput")).to.have.length(0);
            expect(wrapper.find("SourceSummaryView")).to.have.length(1);
        });
    });
});