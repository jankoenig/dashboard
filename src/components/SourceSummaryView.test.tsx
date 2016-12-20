import * as chai from "chai";
import { shallow } from "enzyme";
import * as React from "react";
// import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

import SourceSummary from "../models/source-summary";
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
            expect(wrapper.find("VictoryChart")).to.have.length(0);
        });
    });
    describe("with an empty source summary", function() {
let sourceSummary: SourceSummary = {
            startTime: new Date(),
            endTime: new Date(),
            totalCrashes: 5,
            totalUniqueUsers: 15,
            totalEvents: 0,
            events: [],
            eventLabel: "Label"
        };
        let wrapper = shallow((
            <SourceSummaryView sourceSummary={sourceSummary} />
        ));
        it("renders correctly", function () {
            expect(wrapper.find("p")).to.have.length(1);
            expect(wrapper.find("VictoryChart")).to.have.length(0);
        });
    });
    describe("with a source summary", function () {
        let sourceSummary: SourceSummary = {
            startTime: new Date(),
            endTime: new Date(),
            totalCrashes: 5,
            totalUniqueUsers: 15,
            totalEvents: 67,
            events: [],
            eventLabel: "Label"
        };
        let wrapper = shallow((
            <SourceSummaryView sourceSummary={sourceSummary} />
        ));
        it("renders correctly", function () {
            expect(wrapper.find("p")).to.have.length(0);
            expect(wrapper.find("VictoryChart")).to.have.length(1);
        });
    });
});