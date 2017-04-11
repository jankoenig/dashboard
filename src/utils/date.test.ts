import { expect } from "chai";
import * as sinon from "sinon";

import DateUtil from "./date";

describe("DateUtil", function () {
    describe("daysAgo", function () {
        let clock: sinon.SinonFakeTimers;
        beforeEach(function() {
            clock = sinon.useFakeTimers(new Date(1986, 6, 19, 14).getTime());
        });

        afterEach(function() {
            clock.restore();
        });
        it("returns a date from two days ago", function () {
            let previousDate = DateUtil.daysAgo(2);

            expect(previousDate.getDate()).to.equal(17);
        });
    });
    describe("hoursAgo", function () {
        let clock: sinon.SinonFakeTimers;
        beforeEach(function() {
            clock = sinon.useFakeTimers(new Date(1986, 6, 19, 14).getTime());
        });

        afterEach(function() {
            clock.restore();
        });
        it("returns a date from two hours ago", function () {
            let now = new Date();
            let previousDate = DateUtil.hoursAgo(2);

            expect(previousDate.getHours()).to.equal(now.getHours() - 2);
        });
    });
    describe("buckets", function () {
        describe("for hours", function () {
            let endTime = new Date();
            endTime.setHours(14);
            let startTime = new Date();
            startTime.setHours(endTime.getHours() - 7);
            let buckets = DateUtil.timeBuckets(startTime, endTime, "hours");

            it("returns the correct amount", function () {
                expect(buckets).to.have.length(8); // 7 ago plus the current hour = 8
            });
            it("returns the proper first date", function () {
                expect(buckets[0].getHours()).to.equal(endTime.getHours() - 7);
                expect(buckets[0].getMinutes()).to.equal(0);
            });
            it("returns a correct date an hour after the first", function () {
                expect(buckets[1].getHours()).to.equal(endTime.getHours() - 6);
            });
            it("returns the last date that has the same hour as the current", function () {
                expect(buckets[7].getHours()).to.equal(endTime.getHours());
            });
        });
        describe("for days", function() {
            describe("on the same day", function() {
                it("returns one bucket", function() {
                    let buckets = DateUtil.timeBuckets(new Date(), new Date(), "days");
                    expect(buckets).to.have.length(1);
                });
            });
        });
    });
});