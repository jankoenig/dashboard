import { expect } from "chai";
import * as fetchMock from "fetch-mock";

import { dummyLogs } from "../utils/test";
import log from "./log";

describe("log service", function () {
    describe("getLogs", function () {
        // Mock fetch
        beforeEach(function () {
             fetchMock.get("*", {
                "data": dummyLogs(2)
            });
        });

        afterEach(function() {
            fetchMock.restore();
        });

        it("retreives logs", function (done) {
            let startTime = new Date();
            log.getLogs({ source: "happy_xapp", startTime: startTime }).then(function (logs) {
                expect(logs).to.have.length(2);
                done();
            });
        });
    });

    describe("queryBuilder", function () {
        it("builds a query for a source", function () {
            let query = log.queryBuilder({ source: "source", startTime: new Date() });
            expect(query).to.contain("source=source");
            expect(query).to.contain("start_time=");
            expect(query).to.not.contain("end_time=");
        });
        it("builds a query with source, start time and end time", function () {

            let startTime = new Date(new Date().getTime() - 50000);
            let endTime = new Date();
            let source = "source";

            let query = log.queryBuilder({ source: source, startTime: startTime, endTime: endTime });
            let expectedQuery = "source=" + source +
                "&start_time=" + startTime.toISOString() +
                "&end_time=" + endTime.toISOString();
            expect(query).to.equal(expectedQuery);
        });
    });
});