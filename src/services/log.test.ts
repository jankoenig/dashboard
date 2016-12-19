import { expect } from "chai";
import * as fetchMock from "fetch-mock";

import LogQuery from "../models/log-query";
import Source from "../models/source";
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
});