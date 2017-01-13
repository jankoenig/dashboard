import * as chai from "chai";
import { shallow } from "enzyme";
import * as React from "react";
import { BarChart, LineChart } from "recharts";
import * as sinonChai from "sinon-chai";

import SourceSummary from "../models/source-summary";
import DataTile from "./DataTile";
import SourceSummaryView from "./SourceSummaryView";

// Setup chai with sinon-chai
chai.should();
chai.use(sinonChai);
let expect = chai.expect;

describe("SourceSummaryView", function () {
    describe("without a source summary", function () {
        let wrapper = shallow((
            <SourceSummaryView sourceSummary={undefined} />
        ));
        it("renders correctly", function () {
            expect(wrapper.find("p")).to.have.length(1);
            expect(wrapper.find("ResponsiveContainer")).to.have.length(0);
        });
    });
    describe("with an empty source summary", function () {
        let sourceSummary: SourceSummary = {
            startTime: new Date(),
            endTime: new Date(),
            totalExceptions: 5,
            totalUniqueUsers: 15,
            totalEvents: 0,
            events: [],
            eventLabel: "Label",
            requests: [],
            sessions: []
        };
        let wrapper = shallow((
            <SourceSummaryView sourceSummary={sourceSummary} />
        ));
        it("renders correctly", function () {
            expect(wrapper.find("p")).to.have.length(1);
            expect(wrapper.find(BarChart)).to.have.length(0);
        });
    });
    describe("with a source summary", function () {
        let sourceSummary: SourceSummary = {
            startTime: new Date(),
            endTime: new Date(),
            totalExceptions: 5,
            totalUniqueUsers: 15,
            totalEvents: 67,
            events: [],
            eventLabel: "Label",
            requests: [],
            sessions: []
        };
        let wrapper = shallow((
            <SourceSummaryView sourceSummary={sourceSummary} />
        ));
        it("renders correctly", function () {
            expect(wrapper.find("p")).to.have.length(0);
        });
        it("renders the data tiles", function() {
            expect(wrapper.find(DataTile)).to.have.length(3);
        });
        it("renders the line chart", function() {
            expect(wrapper.find(LineChart)).to.have.length(1);
        });
        it("renders the bar chart", function() {
            expect(wrapper.find(BarChart)).to.have.length(1);
        });
    });
});