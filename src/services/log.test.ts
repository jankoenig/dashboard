import { expect } from "chai";
import * as fetchMock from "fetch-mock";

import LogQuery from "../models/log-query";
import Source from "../models/source";
import { dummyLogs } from "../utils/test";
import log from "./log";

/**
 * CI doesn't like importing "Query", so we're going to make it here.  Take that CI.
 */
export class Query {

    myQuery = "";

    constructor(query?: string) {
        this.myQuery = (query) ? query : "";
    }

    query(): string {
        return this.myQuery;
    };
}

describe("log service", function () {
    describe("getLogs", function () {
        // Mock fetch
        beforeEach(function () {
            fetchMock.get(/https:\/\/logless.bespoken.tools\/v1\/query\?*/, {
                "data": dummyLogs(2)
            });
        });

        afterEach(function () {
            fetchMock.restore();
        });

        it("retreives logs", function (done) {
            let startTime = new Date();
            let source = new Source({
                name: "happy xapp",
                secretKey: "happy_xapp"
            });

            let logQuery = new LogQuery({
                source: source,
                startTime: startTime
            });

            log.getLogs(logQuery).then(function (logs) {
                expect(logs).to.have.length(2);
                done();
            });
        });
    });

    describe("TimeSummary", function () {
        let mockSummary: log.TimeSummary;

        before(function () {
            mockSummary = dummyTimeSummary();
            fetchMock.get(/https:\/\/logless.bespoken.tools\/v1\/timeSummary\?*/, mockSummary);
        });

        after(function () {
            fetchMock.restore();
        });

        it("Endpoint", function () {
            const query: any = new Query();

            return log.getTimeSummary(query).then(function (summary) {
                expect(summary).to.deep.equal(mockSummary);
                // If we made it this far, then we know it went to the proper endpoint.
            });
        });
    });

    describe("IntentSummary", function () {
        let mockSummary: log.IntentSummary;

        before(function () {
            mockSummary = dummyIntentSummary();
            fetchMock.get(/https:\/\/logless.bespoken.tools\/v1\/intentCount\?*/, mockSummary);
        });

        after(function () {
            fetchMock.restore();
        });

        it("Endpoint", function () {
            const query: any = new Query();

            return log.getIntentSummary(query).then(function (summary) {
                expect(summary).to.deep.equal(mockSummary);
                // If we made it this far, then we know it went to the proper endpoint.
            });
        });
    });

    describe("SourceStats", function () {
        let mockSummary: log.SourceStats;

        before(function () {
            mockSummary = dummySourceStat();
            fetchMock.get(/https:\/\/logless.bespoken.tools\/v1\/sourceStats\?*/, mockSummary);
        });

        after(function () {
            fetchMock.restore();
        });

        it("Endpoint", function () {
            const query: any = new Query();

            return log.getSourceSummary(query).then(function (summary) {
                expect(summary).to.deep.equal(mockSummary);
                // If we made it this far, then we know it went to the proper endpoint.
            });
        });
    });
});

function dummyTimeSummary(): log.TimeSummary {
    let newSummary: log.TimeSummary = {
        buckets: [],
        amazonBuckets: [],
        googleBuckets: []
    };
    let date: Date = new Date();
    for (let i = 0; i < 5; ++i) {
        newSummary.buckets.push(dummyBucket(date, i));
        date.setDate(date.getDate() - 1);
    }

    return newSummary;
}

function dummyBucket(date: Date, count: number): log.TimeBucket {
    return {
        date: date.toISOString(),
        count: count
    };
}

function dummyIntentSummary(): log.IntentSummary {
    let newSummary: log.IntentSummary = {
        count: []
    };
    let date: Date = new Date();
    for (let i = 0; i < 5; ++i) {
        newSummary.count.push(dummyIntent("Intent" + i, i));
        date.setDate(date.getDate() - 1);
    }

    return newSummary;
}

function dummyIntent(name: string, count: number): log.IntentBucket {
    return {
        name: name,
        count: count,
        origin: "Amazon.Alexa"
    };
}

function dummySourceStat(): log.SourceStats {
    return {
        source: "sourceName",
        stats: {
            totalUsers: 1,
            totalExceptions: 2,
            totalEvents: 3
        },
        "Amazon.Alexa": {
            totalUsers: 2,
            totalExceptions: 3,
            totalEvents: 1
        },
        "Google.Home": {
            totalUsers: 3,
            totalExceptions: 1,
            totalEvents: 2
        },
        Unknown: {
            totalUsers: 5,
            totalExceptions: 6,
            totalEvents: 7
        },
    };
}
