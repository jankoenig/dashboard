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

describe("SummaryView", function () {

    let source: Source;

    before(function () {
        source = dummySources(1)[0];
    });

    describe("Render", function () {
        let start: moment.Moment;
        let end: moment.Moment;
        let wrapper: ShallowWrapper<any, any>;

        before(function () {
            start = moment().subtract(10, "days");
            end = moment().subtract(2, "days");
        });

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

        describe("Checkboxes", function () {
            let originSelector: ShallowWrapper<any, any>;

            beforeEach(function () {
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
        });
    });
});