import * as chai from "chai";
import { shallow, ShallowWrapper } from "enzyme";
import * as moment from "moment";
import * as React from "react";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

import DataTile from "../../components/DataTile";
import Query, { EndTimeParameter, QueryParameter, SourceParameter, StartTimeParameter } from "../../models/query";
import Source from "../../models/source";
import LogService from "../../services/log";
import { dummySources } from "../../utils/test";
import SourceStats from "./SourceStats";

chai.use(sinonChai);
const expect = chai.expect;

const sources: Source[] = dummySources(2);
const source: Source = sources[0];
const summary: LogService.SourceStats = {
    source: source.secretKey,
    stats: {
        totalUsers: 100,
        totalExceptions: 200,
        totalEvents: 300
    },
    "Amazon.Alexa": {
        totalUsers: 200,
        totalExceptions: 300,
        totalEvents: 100,
    },
    "Google.Home": {
        totalUsers: 300,
        totalExceptions: 100,
        totalEvents: 100
    },
    Unknown: {
        totalUsers: 123,
        totalExceptions: 312,
        totalEvents: 231
    }
};

xdescribe("SourceStats", function () {

    describe("Renders", function () {
        let start: moment.Moment;
        let end: moment.Moment;
        let wrapper: ShallowWrapper<any, any>;

        before(function () {
            start = moment().subtract(7, "days");
            end = moment();

            wrapper = shallow(<SourceStats
                source={source}
                startDate={start}
                endDate={end} />);
        });

        it("Checks the bar graph is there.", function () {
            expect(wrapper.find(DataTile)).to.have.length(3);
        });

        it("Checks the bar graph has a default of empty data.", function () {
            expect(wrapper.find(DataTile).at(0)).to.have.prop("value", "Loading..."); // events
            expect(wrapper.find(DataTile).at(1)).to.have.prop("value", "Loading..."); // users
            expect(wrapper.find(DataTile).at(2)).to.have.prop("value", "Loading..."); // errors
        });
    });

    describe("Loading", function () {
        let start: moment.Moment;
        let end: moment.Moment;
        let statsService: Sinon.SinonStub;
        let wrapper: ShallowWrapper<any, any>;

        before(function () {
            start = moment().subtract(10, "days");
            end = moment().subtract(2, "days");

            statsService = sinon.stub(LogService, "getSourceSummary").returns(Promise.resolve(summary));
        });

        beforeEach(function () {
            statsService.reset();
            wrapper = shallow(<SourceStats
                source={source}
                startDate={start}
                endDate={end} />);
        });

        after(function () {
            statsService.restore();
        });

        it("Tests the data query contains the appropriate parameters.", function () {
            // Returning a promise ensures that the promise in the component is completed before everything else.
            return Promise.resolve(true).then(function () {
                const query: Query = statsService.args[0][0];
                const sourceParameter: SourceParameter = findQueryParameter(query, "source") as SourceParameter;
                const startParameter: StartTimeParameter = findQueryParameter(query, "start_time") as StartTimeParameter;
                const endParameter: EndTimeParameter = findQueryParameter(query, "end_time") as EndTimeParameter;

                expect(startParameter.value).to.equal(start.toISOString());
                expect(endParameter.value).to.equal(end.toISOString());
                expect(sourceParameter.value).to.equal(source.secretKey);
            });
        });

        it("Tests the data query contains the appropriate parameters with new props.", function () {
            wrapper.setProps({ source: sources[1] }); // Forces a call to componentWillReceiveProps
            const query: Query = statsService.args[1][0];
            const sourceParameter: SourceParameter = findQueryParameter(query, "source") as SourceParameter;
            const startParameter: StartTimeParameter = findQueryParameter(query, "start_time") as StartTimeParameter;
            const endParameter: EndTimeParameter = findQueryParameter(query, "end_time") as EndTimeParameter;

            expect(startParameter.value).to.equal(start.toISOString());
            expect(endParameter.value).to.equal(end.toISOString());
            expect(sourceParameter.value).to.equal(sources[1].secretKey);
        });

        it("Tests that the data does *not* load if the parameters are the same.", function () {
            wrapper.setProps({}); // Forces a call to componentWillReceiveProps with the same props.

            expect(statsService).to.be.calledOnce; // Only on mount.
        });

        it("Tests the bar graph has the loaded data.", function () {
            // Returning a promise ensures that the promise in the component is completed before everything else.
            return Promise.resolve(true).then(function () {
                expect(wrapper.find(DataTile).at(0)).to.have.prop("value", "300"); // events
                expect(wrapper.find(DataTile).at(1)).to.have.prop("value", "100"); // users
                expect(wrapper.find(DataTile).at(2)).to.have.prop("value", "200"); // errors
            });
        });

        it("Tests the defaults were set when source is undefined.", function () {
            const newWrapper = shallow(<SourceStats
                source={undefined}
                startDate={start}
                endDate={end} />);

            return Promise.resolve(true).then(function () {
                expect(newWrapper.find(DataTile).at(0)).to.have.prop("value", "N/A"); // events
                expect(newWrapper.find(DataTile).at(1)).to.have.prop("value", "N/A"); // users
                expect(newWrapper.find(DataTile).at(2)).to.have.prop("value", "N/A"); // errors
            });
        });

        it("Tests the defaults were set when source is set to undefined through props.", function () {
            return Promise.resolve(true).then(function () {
                wrapper.setProps({ source: undefined });
                expect(wrapper.find(DataTile).at(0)).to.have.prop("value", "N/A"); // events
                expect(wrapper.find(DataTile).at(1)).to.have.prop("value", "N/A"); // users
                expect(wrapper.find(DataTile).at(2)).to.have.prop("value", "N/A"); // errors
            });
        });
    });

    describe("Error condition", function () {
        let start: moment.Moment;
        let end: moment.Moment;
        let timeService: Sinon.SinonStub;
        let wrapper: ShallowWrapper<any, any>;

        before(function () {
            start = moment().subtract(10, "days");
            end = moment().subtract(2, "days");

            timeService = sinon.stub(LogService, "getSourceSummary").returns(Promise.reject(new Error("Error per condition of the test.")));

            wrapper = shallow(<SourceStats
                source={source}
                startDate={start}
                endDate={end} />);

            wrapper.setProps({}); // Forces a call to componentWillReceiveProps
        });

        after(function () {
            timeService.restore();
        });

        it("Tests the bar graph has the loaded data.", function () {
            return Promise.resolve(true).then(function () {
                expect(wrapper.find(DataTile).at(0)).to.have.prop("value", "N/A"); // events
                expect(wrapper.find(DataTile).at(1)).to.have.prop("value", "N/A"); // users
                expect(wrapper.find(DataTile).at(2)).to.have.prop("value", "N/A"); // errors
            });
        });
    });

    describe("Item Swapping", function () {
        let start: moment.Moment;
        let end: moment.Moment;
        let statsService: Sinon.SinonStub;
        let wrapper: ShallowWrapper<any, any>;

        before(function () {
            start = moment().subtract(10, "days");
            end = moment().subtract(2, "days");

            statsService = sinon.stub(LogService, "getSourceSummary").returns(Promise.resolve(summary));
        });

        beforeEach(function () {
            statsService.reset();
            wrapper = shallow(<SourceStats
                source={source}
                startDate={start}
                endDate={end} />);

            return Promise.resolve(true).then(function () {
                // This will let the initial load finish before swapping.
                wrapper.setProps(wrapper.props());
            });
        });

        after(function() {
            statsService.restore();
        });

        it("Tests that Amazon Alexa is selected on props change.", function () {
            wrapper.setProps({ selectedEntries: "Amazon.Alexa" });

            const stats = summary["Amazon.Alexa"];
            checkStats(stats);
        });

        it("Tests that Google Home is selected on props change.", function () {
            wrapper.setProps({ selectedEntries: "Google.Home" });

            const stats = summary["Google.Home"];
            checkStats(stats);
        });

        it("Tests that Unknown is selected on props change.", function () {
            wrapper.setProps({ selectedEntries: "Unknown" });

            const stats = summary.Unknown;
            checkStats(stats);
        });

        it("Tests that the regular stats are selected on props change.", function () {
            wrapper.setProps({ selectedEntries: "Amazon.Alexa" }); // Swapping to another.
            wrapper.setProps({ selectedEntries: "stats" }); // Woops.  Swapping back.

            const stats = summary.stats;
            checkStats(stats);
        });

        it("Tests that it combines the entries are selected on props change.", function() {
            wrapper.setProps({ selectedEntries: [ "Amazon.Alexa", "Google.Home" ]});

            const stats = {
                totalEvents: summary["Amazon.Alexa"].totalEvents + summary["Google.Home"].totalEvents,
                totalExceptions: summary["Amazon.Alexa"].totalExceptions + summary["Google.Home"].totalExceptions,
                totalUsers: summary["Amazon.Alexa"].totalUsers + summary["Google.Home"].totalUsers
            };
            checkStats(stats);
        });

        it("Tests that the default is selected when no entries are selected.", function() {
            wrapper.setProps({ selectedEntries: [] });

            const stats = {
                totalEvents: 0,
                totalExceptions: 0,
                totalUsers: 0
            };

            checkStats(stats);
        });

        it("Tests that it handles entries that do not exist.", function() {
            wrapper.setProps({ selectedEntries: [ "stats", "Noop" ]});

            const stats = summary.stats;
            checkStats(stats);
        });

        function checkStats(stats: LogService.TotalStat) {
            expect(wrapper.find(DataTile).at(0)).to.have.prop("value", stats.totalEvents.toString()); // events
            expect(wrapper.find(DataTile).at(1)).to.have.prop("value", stats.totalUsers.toString()); // users
            expect(wrapper.find(DataTile).at(2)).to.have.prop("value", stats.totalExceptions.toString()); // errors
        }
    });
});

function findQueryParameter(q: Query, parameter: string): QueryParameter {
    for (let p of q.queryElements) {
        if (p.parameter === parameter) {
            return p;
        }
    }
    return undefined;
}