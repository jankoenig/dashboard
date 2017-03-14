import * as chai from "chai";
import { shallow } from "enzyme";
import * as moment from "moment";
import * as React from "react";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

import LogService from "../../services/log";
import { dummyLogs, dummySources } from "../../utils/test";
import SourceFullSummary from "./SourceFullSummary";
import { SourcePage } from "./SourcePage";

chai.use(sinonChai);
chai.use(require("chai-datetime"));
let expect = chai.expect;

describe("Source Page", function () {
    let logs = dummyLogs(10);
    let source = dummySources(1)[0];

    describe("Initial load", function () {
        let getLogs: Sinon.SinonStub;
        let getTimeSummary: Sinon.SinonStub;
        let getIntentSummary: Sinon.SinonStub;
        let getSourceSummary: Sinon.SinonStub;
        let goHome: Sinon.SinonStub;
        let removeSource: Sinon.SinonStub;

        before(function () {
            getLogs = sinon.stub(LogService, "getLogs").returns(Promise.resolve(logs));
            getTimeSummary = sinon.stub(LogService, "getTimeSummary").returns(Promise.resolve(dummyTimeSummary(5)));
            getIntentSummary = sinon.stub(LogService, "getIntentSummary").returns(Promise.resolve(dummyIntentSummary(5)));
            getSourceSummary = sinon.stub(LogService, "getSourceSummary").returns(Promise.resolve(dummySourceStats()));
            goHome = sinon.stub();
            removeSource = sinon.stub();
        });

        afterEach(function () {
            getLogs.reset();
            getTimeSummary.reset();
            getIntentSummary.reset();
            getSourceSummary.reset();
            goHome.reset();
            removeSource.reset();
        });

        after(function () {
            getLogs.restore();
            getTimeSummary.restore();
            getIntentSummary.restore();
            getSourceSummary.restore();
        });
        it("Tests that the summary view is there.", function () {
            const wrapper = shallow((
                <SourcePage source={source} />
            ));

            expect(wrapper.find(SourceFullSummary)).to.have.length(1);
        });

        it("Tests that the summary view has the appropriate props.", function () {
            const start = moment().subtract(7, "days");
            const end = moment();
            const wrapper = shallow((
                <SourcePage source={source} />
            ));

            const summary = wrapper.find(SourceFullSummary);
            expect(summary).to.have.prop("source", source);

            // Can't use the convience of chai to check dates.
            const startProp = summary.prop("startDate") as moment.Moment;
            const endProp = summary.prop("endDate") as moment.Moment;
            expect(startProp.toDate()).to.equalDate(start.toDate());
            expect(endProp.toDate()).to.equalDate(end.toDate());
        });
    });
});

function dummyTimeSummary(size: number): LogService.TimeSummary {
    return {
        buckets: dummyTimeBuckets(size),
        amazonBuckets: dummyTimeBuckets(size / 2),
        googleBuckets: dummyTimeBuckets(size / 2)
    };
}

function dummyIntentSummary(size: number): LogService.IntentSummary {
    return {
        count: dummyIntentBuckets(size)
    };
}

function dummySourceStats(): LogService.SourceStats {
    return {
        source: randomNameGenerator(),
        stats: {
            totalUsers: 1000,
            totalEvents: 2000,
            totalExceptions: 5 // Don't want to go crazy here.
        }
    };
}

function dummyTimeBuckets(size: number): LogService.TimeBucket[] {
    let buckets: LogService.TimeBucket[] = [];

    let date: Date = new Date();
    for (let i = 0; i < size; ++i) {
        buckets.push({
            date: date.toISOString(),
            count: i
        });
        date.setDate(date.getDate() - 1);
    }

    return buckets;
}

function dummyIntentBuckets(size: number): LogService.IntentBucket[] {
    let buckets: LogService.IntentBucket[] = [];

    for (let i = 0; i < size; ++i) {
        buckets.push({
            name: randomNameGenerator(),
            count: i,
            origin: "Amazon.Alexa"
        });
    }

    return buckets;
}

function randomNameGenerator(): string {
    let name: string = "";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < 5; ++i) {
        name += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return name;
}