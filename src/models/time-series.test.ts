import { expect } from "chai";

import { TimeSeriesDatum } from "./time-series";

describe("TimeSeriesDatum", function() {
    describe("constructor", function() {

        let now = new Date();

        let timeSeriesDatum = new TimeSeriesDatum({
            date: now,
            data: [ {timestamp: now}]
        });

        it("sets the date", function() {
            expect(timeSeriesDatum.date).to.equal(now);
        });
        it("sets the data", function() {
            expect(timeSeriesDatum.data).to.have.length(1);
        });
        it("derives the length", function() {
            expect(timeSeriesDatum.length).to.equal(1);
        });
        it("derives the time", function() {
            expect(timeSeriesDatum.time).to.equal(now.getTime());
        });
    });
});