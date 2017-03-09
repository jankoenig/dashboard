import * as chai from "chai";
import { shallow, ShallowWrapper } from "enzyme";
import * as moment from "moment";
import * as React from "react";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

import TimeChart from "../../components/Graphs/Line/TimeChart";
import Query, { EndTimeParameter, FillGapsParameter, GranularityParameter, QueryParameter, SortParameter, SourceParameter, StartTimeParameter } from "../../models/query";
import Source from "../../models/source";
import LogService from "../../services/log";
import { dummySources } from "../../utils/test";
import SourceTimeSummary, { LineProps } from "./SourceTimeSummary";

chai.use(sinonChai);
const expect = chai.expect;

const summary: LogService.TimeSummary = {
    buckets: createBuckets(10),
    amazonBuckets: createBuckets(10),
    googleBuckets: createBuckets(10)
};

describe("SourceTimeSummary", function () {

    let sources: Source[];
    let source: Source;

    before(function () {
        sources = dummySources(2);
        source = sources[0];
    });

    describe("Renders", function () {
        let start: moment.Moment;
        let end: moment.Moment;
        let wrapper: ShallowWrapper<any, any>;

        before(function () {
            start = moment().subtract(7, "days");
            end = moment();

            wrapper = shallow(<SourceTimeSummary
                source={source}
                startDate={start}
                endDate={end} />);
        });

        it("Checks the bar graph is there.", function () {
            expect(wrapper.find(TimeChart)).to.have.length(1);
        });

        it("Checks the bar graph has a default of empty data.", function () {
            expect(wrapper.find(TimeChart).prop("data")).to.deep.equal([]);
        });

        describe("Lines", function () {
            const lines: LineProps[] = [{
                dataKey: "all",
                name: "All",
                stroke: "#000000"
            }, {
                dataKey: "First",
                name: "FirstName",
                stroke: "#FF0000"
            }, {
                dataKey: "Second",
                name: "SecondName",
                stroke: "#FFFF00"
            }];

            before(function () {
                wrapper = shallow(<SourceTimeSummary
                    source={source}
                    startDate={start}
                    endDate={end}
                    lines={lines} />);
            });

            it("Tests the lines are applied to the inner timechart.", function() {
                expect(wrapper.find(TimeChart).at(0)).to.have.prop("lines", lines);
            });
        });
    });

    describe("Loading", function () {
        let start: moment.Moment;
        let end: moment.Moment;
        let timeService: Sinon.SinonStub;
        let wrapper: ShallowWrapper<any, any>;

        before(function () {
            start = moment().subtract(10, "days");
            end = moment().subtract(2, "days");

            timeService = sinon.stub(LogService, "getTimeSummary").returns(Promise.resolve(summary));
        });

        beforeEach(function () {
            timeService.reset();

            wrapper = shallow(<SourceTimeSummary
                source={source}
                startDate={start}
                endDate={end} />);
        });

        after(function () {
            timeService.restore();
        });

        it("Tests the data query contains the appropriate parameters when mounted.", function () {
            const query: Query = timeService.args[0][0];
            const sortParameter: SortParameter = findQueryParameter(query, "date_sort") as SortParameter;
            const sourceParameter: SourceParameter = findQueryParameter(query, "source") as SourceParameter;
            const startParameter: StartTimeParameter = findQueryParameter(query, "start_time") as StartTimeParameter;
            const endParameter: EndTimeParameter = findQueryParameter(query, "end_time") as EndTimeParameter;
            const fillParameter: FillGapsParameter = findQueryParameter(query, "fill_gaps") as FillGapsParameter;
            const granulParameter: GranularityParameter = findQueryParameter(query, "granularity") as GranularityParameter;


            expect(startParameter.value).to.equal(start.toISOString());
            expect(endParameter.value).to.equal(end.toISOString());
            expect(sourceParameter.value).to.equal(source.secretKey);
            expect(sortParameter.value).to.equal("asc");
            expect(granulParameter.value).to.equal("hour");
            expect(fillParameter.value).to.equal(true);
        });

        it("Tests the data query contains the appropriate parameters.", function () {
            wrapper.setProps({ source: sources[1] }); // Forces a call to componentWillReceiveProps

            const query: Query = timeService.args[1][0];
            const sortParameter: SortParameter = findQueryParameter(query, "date_sort") as SortParameter;
            const sourceParameter: SourceParameter = findQueryParameter(query, "source") as SourceParameter;
            const startParameter: StartTimeParameter = findQueryParameter(query, "start_time") as StartTimeParameter;
            const endParameter: EndTimeParameter = findQueryParameter(query, "end_time") as EndTimeParameter;
            const fillParameter: FillGapsParameter = findQueryParameter(query, "fill_gaps") as FillGapsParameter;
            const granulParameter: GranularityParameter = findQueryParameter(query, "granularity") as GranularityParameter;


            expect(startParameter.value).to.equal(start.toISOString());
            expect(endParameter.value).to.equal(end.toISOString());
            expect(sourceParameter.value).to.equal(sources[1].secretKey);
            expect(sortParameter.value).to.equal("asc");
            expect(granulParameter.value).to.equal("hour");
            expect(fillParameter.value).to.equal(true);
        });

        it("Tests the bar graph has the loaded data.", function () {
            // Returning a promise ensures that the promise in the component is completed before everything else.
            return Promise.resolve(true).then(function () {
                expect(wrapper.find(TimeChart).prop("data")).to.have.length(summary.buckets.length);
            });
        });

        it("Tests the defaults were set when source is undefined.", function () {
            const newWrapper = shallow(<SourceTimeSummary
                source={undefined}
                startDate={start}
                endDate={end} />);

            return Promise.resolve(true).then(function () {
                expect(newWrapper.find(TimeChart).prop("data")).to.have.length(0);
            });
        });

        it("Tests the defaults were set when source is set to undefined through props.", function () {
            return Promise.resolve(true).then(function () {
                wrapper.setProps({ source: undefined });
                expect(wrapper.find(TimeChart).prop("data")).to.have.length(0);
            });
        });

        it("Tests the default data is present when nothing is returned.", function () {
            const newSummary: LogService.TimeSummary = {
                buckets: [],
                amazonBuckets: [],
                googleBuckets: []
            };
            timeService.restore();
            timeService = sinon.stub(LogService, "getTimeSummary").returns(Promise.resolve(newSummary));

            wrapper.setProps({}); // causes a re-query.

            return Promise.resolve(true).then(function () {
                const daysBetween = end.diff(start, "days");
                expect(wrapper.find(TimeChart).prop("data")).to.have.length(daysBetween); // It created default data.
            });
        });
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

function createBuckets(num: number): LogService.TimeBucket[] {
    let bucks: LogService.TimeBucket[] = [];

    const day = moment();
    for (let i = 0; i < num; ++i) {
        bucks.push({
            date: day.subtract(i, "days").toISOString(),
            count: i
        });
    }

    return bucks;
}