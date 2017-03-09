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
    }
};

describe("SourceStats", function () {

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
        let timeService: Sinon.SinonStub;
        let wrapper: ShallowWrapper<any, any>;

        before(function () {
            start = moment().subtract(10, "days");
            end = moment().subtract(2, "days");

            timeService = sinon.stub(LogService, "getSourceSummary").returns(Promise.resolve(summary));
        });

        beforeEach(function () {
            timeService.reset();
            wrapper = shallow(<SourceStats
                source={source}
                startDate={start}
                endDate={end} />);
        });

        after(function () {
            timeService.restore();
        });

        it("Tests the data query contains the appropriate parameters.", function () {
            // Returning a promise ensures that the promise in the component is completed before everything else.
            return Promise.resolve(true).then(function () {
                const query: Query = timeService.args[0][0];
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
            const query: Query = timeService.args[1][0];
            const sourceParameter: SourceParameter = findQueryParameter(query, "source") as SourceParameter;
            const startParameter: StartTimeParameter = findQueryParameter(query, "start_time") as StartTimeParameter;
            const endParameter: EndTimeParameter = findQueryParameter(query, "end_time") as EndTimeParameter;

            expect(startParameter.value).to.equal(start.toISOString());
            expect(endParameter.value).to.equal(end.toISOString());
            expect(sourceParameter.value).to.equal(sources[1].secretKey);
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
});

function findQueryParameter(q: Query, parameter: string): QueryParameter {
    for (let p of q.queryElements) {
        if (p.parameter === parameter) {
            return p;
        }
    }
    return undefined;
}