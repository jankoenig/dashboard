import { expect } from "chai";

import DateUtil from "../utils/date";
import LogQuery from "./log-query";
import Source from "./source";

describe("LogQuery", function () {
    describe("constructor", function () {
        let source = new Source({ name: "source" });

        it("sets the provided properties", function () {
            let endTime = new Date();
            let startTime = DateUtil.daysAgo(2);

            let logQueryProps = {
                startTime: startTime,
                endTime: endTime,
                source: source
            };

            let logQuery = new LogQuery(logQueryProps);

            expect(logQuery.startTime).to.equal(startTime);
            expect(logQuery.endTime).to.equal(endTime);
            expect(logQuery.source).to.equal(source);
        });
        it("sets the start date if one isn't provided", function () {

            let logQuery = new LogQuery({source: source});

            expect(logQuery.startTime).to.exist;
            expect(logQuery.source).to.equal(source);
            expect(logQuery.endTime).to.exist;
        });
    });
    describe("queryBuilder", function () {

        let source = new Source({ name: "name", secretKey: "source" });


        it("builds a query for a source", function () {

            let logQuery = new LogQuery({
                source: source,
                startTime: new Date(),
                endTime: new Date()
            });

            let query = logQuery.queryString;
            expect(query).to.contain("source=source");
            expect(query).to.contain("start_time=");
            expect(query).to.contain("end_time=");
        });
        it("builds a query with source, start time and end time", function () {

            let logQuery = new LogQuery({
                source: source,
                startTime: new Date(new Date().getTime() - 50000),
                endTime: new Date()
            });

            let query = logQuery.queryString;
            let expectedQuery = "source=" + source.secretKey +
                "&start_time=" + logQuery.startTime.toISOString() +
                "&end_time=" + logQuery.endTime.toISOString();
            expect(query).to.equal(expectedQuery);
        });
    });
});