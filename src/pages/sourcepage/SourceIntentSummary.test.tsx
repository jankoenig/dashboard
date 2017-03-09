import * as chai from "chai";
import { shallow, ShallowWrapper } from "enzyme";
import * as moment from "moment";
import * as React from "react";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

import BarChart from "../../components/Graphs/Bar/CountChart";
import Query, { EndTimeParameter, QueryParameter, SortParameter, SourceParameter, StartTimeParameter } from "../../models/query";
import Source from "../../models/source";
import LogService from "../../services/log";
import { dummySources } from "../../utils/test";
import SourceIntentSummary from "./SourceIntentSummary";

chai.use(sinonChai);
const expect = chai.expect;

const summary: LogService.IntentSummary = {
    count: createBuckets(10)
};

describe("SourceIntentSummary", function () {

    let source: Source;

    before(function () {
        source = dummySources(1)[0];
    });

    describe("Renders", function () {
        let start: moment.Moment;
        let end: moment.Moment;
        let wrapper: ShallowWrapper<any, any>;

        before(function () {
            start = moment().subtract(7, "days");
            end = moment();

            wrapper = shallow(<SourceIntentSummary
                source={source}
                startDate={start}
                endDate={end} />);
        });

        it("Checks the bar graph is there.", function () {
            expect(wrapper.find(BarChart)).to.have.length(1);
        });

        it("Checks the bar graph has a default of empty data.", function () {
            expect(wrapper.find(BarChart).prop("data")).to.deep.equal([]);
        });
    });

    describe("Loading", function () {
        let start: moment.Moment;
        let end: moment.Moment;
        let intentService: Sinon.SinonStub;
        let wrapper: ShallowWrapper<any, any>;

        before(function () {
            start = moment().subtract(10, "days");
            end = moment().subtract(2, "days");

            intentService = sinon.stub(LogService, "getIntentSummary").returns(Promise.resolve(summary));
        });

        beforeEach(function () {
            wrapper = shallow(<SourceIntentSummary
                source={source}
                startDate={start}
                endDate={end} />);
        });

        after(function () {
            intentService.restore();
        });

        it("Tests the data queries on component will mount.", function () {
            return Promise.resolve(true).then(function () {
                const query: Query = intentService.args[0][0];
                const sortParameter: SortParameter = findQueryParameter(query, "count_sort") as SortParameter;
                const sourceParameter: SourceParameter = findQueryParameter(query, "source") as SourceParameter;
                const startParameter: StartTimeParameter = findQueryParameter(query, "start_time") as StartTimeParameter;
                const endParameter: EndTimeParameter = findQueryParameter(query, "end_time") as EndTimeParameter;

                expect(startParameter.value).to.equal(start.toISOString());
                expect(endParameter.value).to.equal(end.toISOString());
                expect(sourceParameter.value).to.equal(source.secretKey);
                expect(sortParameter.value).to.equal("desc");
            });
        });

        it("Tests the data query contains the appropriate parameters after a set props.", function () {
            wrapper.setProps({}); // Forces a call to componentWillReceiveProps
            // Returning a promise ensures that the promise in the component is completed before everything else.
            return Promise.resolve(true).then(function () {
                const query: Query = intentService.args[1][0]; // Called once from mount.
                const sortParameter: SortParameter = findQueryParameter(query, "count_sort") as SortParameter;
                const sourceParameter: SourceParameter = findQueryParameter(query, "source") as SourceParameter;
                const startParameter: StartTimeParameter = findQueryParameter(query, "start_time") as StartTimeParameter;
                const endParameter: EndTimeParameter = findQueryParameter(query, "end_time") as EndTimeParameter;

                expect(startParameter.value).to.equal(start.toISOString());
                expect(endParameter.value).to.equal(end.toISOString());
                expect(sourceParameter.value).to.equal(source.secretKey);
                expect(sortParameter.value).to.equal("desc");
            });
        });

        it("Tests the bar graph has the loaded data.", function () {
            return Promise.resolve(true).then(function () {
                expect(wrapper.find(BarChart).prop("data")).to.have.length(summary.count.length);
            });
        });

        it("Tests the default stats when source is undefined.", function () {
            const newWrapper = shallow(<SourceIntentSummary
                source={undefined}
                startDate={start}
                endDate={end} />);

            expect(newWrapper.find(BarChart).prop("data")).to.have.length(0);
        });

        it("Tests the default stats when source is set to undefined through props.", function () {
            wrapper.setProps({ source: undefined });

            expect(wrapper.find(BarChart).prop("data")).to.have.length(0);
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

function createBuckets(num: number): LogService.IntentBucket[] {
    let bucks: LogService.IntentBucket[] = [];

    for (let i = 0; i < num; ++i) {
        bucks.push({
            name: "bucket" + i,
            count: i,
            origin: "Amazon.Alexa"
        });
    }

    return bucks;
}