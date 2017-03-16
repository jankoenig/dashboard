import * as chai from "chai";
import { shallow, ShallowWrapper } from "enzyme";
import * as moment from "moment";
import * as React from "react";

import Source from "../../models/source";
import { dummySources } from "../../utils/test";
import SourceFullSummary from "./SourceFullSummary";
import SourceIntentSummary from "./SourceIntentSummary";
import SourceOriginSelector from "./SourceOriginSelector";
import SourceStats from "./SourceStats";
import SourceTimeSummary from "./SourceTimeSummary";

const expect = chai.expect;

describe("SourceFullSummary", function () {

    let start: moment.Moment;
    let end: moment.Moment;
    let source: Source;

    before(function () {
        source = dummySources(1)[0];
        start = moment().subtract(10, "days");
        end = moment().subtract(2, "days");
    });

    describe("Render", function () {
        let wrapper: ShallowWrapper<any, any>;

        beforeEach(function () {
            wrapper = shallow(<SourceFullSummary
                source={source}
                startDate={start}
                endDate={end}
                header={"Test Header"} />);
        });

        it("Tests the header exists", function () {
            expect(wrapper.find("h4")).to.have.text("Test Header");
        });

        it("Tests the intent summary exists.", function () {
            expect(wrapper.find(SourceIntentSummary)).to.have.length(1);
        });

        it("Tests the intent summary has the appropriate props.", function () {
            const wrap = wrapper.find(SourceIntentSummary).at(0);
            expect(wrap).to.have.prop("source", source);
            expect(wrap).to.have.prop("startDate", start);
            expect(wrap).to.have.prop("endDate", end);
        });

        it("Tests the stats summary exists.", function () {
            expect(wrapper.find(SourceStats)).to.have.length(1);
        });

        it("Tests the stats has the appropriate props.", function () {
            const wrap = wrapper.find(SourceStats).at(0);
            expect(wrap).to.have.prop("source", source);
            expect(wrap).to.have.prop("startDate", start);
            expect(wrap).to.have.prop("endDate", end);
        });

        it("Tests the time summary exists.", function () {
            expect(wrapper.find(SourceTimeSummary)).to.have.length(1);
        });

        it("Tests the time summary has the appropriate props.", function () {
            const wrap = wrapper.find(SourceTimeSummary).at(0);
            expect(wrap).to.have.prop("source", source);
            expect(wrap).to.have.prop("startDate", start);
            expect(wrap).to.have.prop("endDate", end);
        });

        it("Tests the source origin checker is there", function () {
            expect(wrapper.find(SourceOriginSelector)).to.have.length(1);
        });

        it("Tests the source origin checker has the props.", function () {
            const wrap = wrapper.find(SourceOriginSelector).at(0);
            expect(wrap.prop("options")).to.have.length(3); // three origins.
            expect(wrap.prop("onCheck")).to.exist;
        });

    });

    describe("Checkboxes", function () {
        let wrapper: ShallowWrapper<any, any>;
        let originSelector: ShallowWrapper<any, any>;

        beforeEach(function () {
            wrapper = shallow(<SourceFullSummary
                source={source}
                startDate={start}
                endDate={end}
                header={"Test Header"} />);

            originSelector = wrapper.find(SourceOriginSelector).at(0);
        });

        it("tests clicking on a checkbox will alter it", function () {
            originSelector.simulate("check", 0, "All");

            // rerenders
            originSelector = wrapper.find(SourceOriginSelector).at(0);

            let optionsProp = originSelector.prop("options");
            expect(optionsProp[0].checked).to.equal(false);

            originSelector.simulate("check", 0, "All");

            // rerenders
            originSelector = wrapper.find(SourceOriginSelector).at(0);

            optionsProp = originSelector.prop("options");
            expect(optionsProp[0].checked).to.equal(true);
        });

        it("Tests the lines passed to the time summary are only what is checked.", function () {
            originSelector.simulate("check", 0, "All");

            const timesummary = wrapper.find(SourceTimeSummary).at(0);
            const summarylines = timesummary.prop("lines");

            expect(summarylines).to.have.length(2);

            expect(summarylines[0]).to.have.property("dataKey", "Amazon.Alexa");
            expect(summarylines[1]).to.have.property("dataKey", "Google.Home");
        });

        it("Tests nothing happens to the bars if \"total\" is unchecked.", function () {
            originSelector.simulate("check", 0, "Total");

            const intentSummary = wrapper.find(SourceIntentSummary).at(0);
            const summaryBars = intentSummary.prop("bars");

            expect(summaryBars).to.have.length(2);

            expect(summaryBars[0]).to.have.property("dataKey", "Amazon.Alexa");
            expect(summaryBars[1]).to.have.property("dataKey", "Google.Home");
        });

        it("Tests the bars passed to the intent summary are only what is checked.", function () {
            originSelector.simulate("check", 1, "Amazon");

            const intentSummary = wrapper.find(SourceIntentSummary).at(0);
            const summaryBars = intentSummary.prop("bars");

            expect(summaryBars).to.have.length(1);

            expect(summaryBars[0]).to.have.property("dataKey", "Google.Home");
        });
    });
});