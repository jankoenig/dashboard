import * as chai from "chai";
import { shallow, ShallowWrapper } from "enzyme";
import * as moment from "moment";
import * as React from "react";

import Source from "../../models/source";
import { dummySources } from "../../utils/test";
import SourceFullSummary from "./SourceFullSummary";
import SourceIntentSummary from "./SourceIntentSummary";
import SourceOriginSelector from "./SourceOriginSelector";
import SourceResponseTimeSummary from "./SourceResponseTimeAverage";
import SourceStats from "./SourceStats";
import SourceTimeSummary from "./SourceTimeSummary";
import SourceUpTime from "./SourceUptime";

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

        it("Tests the response time average summary exists.", function () {
            expect(wrapper.find(SourceResponseTimeSummary)).to.have.length(1);
        });

        it("Tests the response time average summary has the appropriate props.", function () {
            const wrap = wrapper.find(SourceResponseTimeSummary).at(0);
            expect(wrap).to.have.prop("source", source);
            expect(wrap).to.have.prop("interval", 5);
            expect(wrap).to.have.prop("startDate", start);
            expect(wrap).to.have.prop("endDate", end);
        });

        it("Tests the up time summary exists when there is data", function () {
            expect(wrapper.find(SourceUpTime)).to.have.length(1);
        });

        it("Tests the up time summary has the appropriate props.", function () {
            const wrap = wrapper.find(SourceUpTime).at(0);
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
            originSelector.simulate("check", 0, "All", false);

            // rerenders
            originSelector = wrapper.find(SourceOriginSelector).at(0);

            let optionsProp = originSelector.prop("options");
            expect(optionsProp[0].checked).to.equal(false);

            originSelector.simulate("check", 0, "All", true);

            // rerenders
            originSelector = wrapper.find(SourceOriginSelector).at(0);

            optionsProp = originSelector.prop("options");
            expect(optionsProp[0].checked).to.equal(true);
        });

        it("Tests the lines passed to the time summary are only what is checked.", function () {
            originSelector.simulate("check", 0, "All", false);

            const timesummary = wrapper.find(SourceTimeSummary).at(0);
            const summarylines = timesummary.prop("lines");

            expect(summarylines).to.have.length(2);

            expect(summarylines[0]).to.have.property("dataKey", "Amazon.Alexa");
            expect(summarylines[1]).to.have.property("dataKey", "Google.Home");
        });

        it("Tests nothing happens to the bars if \"total\" is unchecked.", function () {
            originSelector.simulate("check", 0, "Total", false);

            const intentSummary = wrapper.find(SourceIntentSummary).at(0);
            const summaryBars = intentSummary.prop("bars");

            expect(summaryBars).to.have.length(2);

            expect(summaryBars[0]).to.have.property("dataKey", "Amazon.Alexa");
            expect(summaryBars[1]).to.have.property("dataKey", "Google.Home");
        });

        it("Tests the bars passed to the intent summary are only what is checked.", function () {
            originSelector.simulate("check", 1, "Amazon", false);

            const intentSummary = wrapper.find(SourceIntentSummary).at(0);
            const summaryBars = intentSummary.prop("bars");

            expect(summaryBars).to.have.length(1);

            expect(summaryBars[0]).to.have.property("dataKey", "Google.Home");
        });

        describe("SourcePage selection", function () {

            it("Tests the stat entry passed is defaulted to stats.", function () {
                const statsSummary = wrapper.find(SourceStats).at(0);
                const statEntry = statsSummary.prop("selectedEntries");

                expect(statEntry).to.deep.equal(["stats"]);
            });

            it("Tests that only stats is passed in when \"All\" is still selected", function () {
                originSelector.simulate("check", 0, "Total", true);
                originSelector.simulate("check", 1, "Amazon", false);

                let statsSummary = wrapper.find(SourceStats).at(0);
                let statEntry = statsSummary.prop("selectedEntries");

                expect(statEntry).to.deep.equal(["stats"]);

                originSelector.simulate("check", 2, "Google", false);

                statsSummary = wrapper.find(SourceStats).at(0);
                statEntry = statsSummary.prop("selectedEntries");

                expect(statEntry).to.deep.equal(["stats"]);
            });

            describe("All Not Selected", function () {
                beforeEach(function () {
                    originSelector.simulate("check", 0, "All", false);
                });

                it("Tests that the stat entry combines both parameters.", function () {
                    originSelector.simulate("check", 1, "Amazon", true);
                    originSelector.simulate("check", 2, "Google", true);

                    const statsSummary = wrapper.find(SourceStats).at(0);
                    const statEntry = statsSummary.prop("selectedEntries");

                    expect(statEntry).to.have.length(2);
                    expect(statEntry).to.contain("Amazon.Alexa");
                    expect(statEntry).to.contain("Google.Home");
                });
            });

            describe("No initial selected", function () {
                beforeEach(function () {
                    originSelector.simulate("check", 0, "All", false);
                    originSelector.simulate("check", 1, "Amazon", false);
                    originSelector.simulate("check", 2, "Google", false);
                });

                it("Tests the stat entry passed to the source stats are right when Amazon is checked.", function () {
                    originSelector.simulate("check", 1, "Amazon", true);

                    const statsSummary = wrapper.find(SourceStats).at(0);
                    const statEntry = statsSummary.prop("selectedEntries");

                    expect(statEntry).to.deep.equal(["Amazon.Alexa"]);
                });

                it("Tests the stat entry passed to the source stats are what when Google is checked.", function () {
                    originSelector.simulate("check", 2, "Google", true);

                    const statsSummary = wrapper.find(SourceStats).at(0);
                    const statEntry = statsSummary.prop("selectedEntries");

                    expect(statEntry).to.deep.equal(["Google.Home"]);
                });

                it("Tests the stat entry passed to the source stats are what when all is checked.", function () {
                    originSelector.simulate("check", 0, "All", true);

                    const statsSummary = wrapper.find(SourceStats).at(0);
                    const statEntry = statsSummary.prop("selectedEntries");

                    expect(statEntry).to.deep.equal(["stats"]);
                });
            });
        });
    });
});
