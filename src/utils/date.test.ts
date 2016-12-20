import { expect } from "chai";

import DateUtil from "./date";

describe("DateUtil", function () {
    describe("daysAgo", function () {
        it("returns a date from two days ago", function () {
            let now = new Date();
            let previousDate = DateUtil.daysAgo(2);

            expect(previousDate.getDate()).to.equal(now.getDate() - 2);
        });
    });
    describe("hoursAgo", function () {
        it("returns a date from two hours ago", function () {
            let now = new Date();
            let previousDate = DateUtil.hoursAgo(2);

            expect(previousDate.getHours()).to.equal(now.getHours() - 2);

        });
    });
    describe("buckets", function () {
        describe("for hours", function () {
            let buckets = DateUtil.timeBuckets(DateUtil.hoursAgo(7), new Date(), "hours");

            it("returns the correct amount", function () {
                expect(buckets).to.have.length(8); // 7 ago plus the current hour = 8
            });
            it("returns the proper first date", function () {
                expect(buckets[0].getHours()).to.equal(new Date().getHours() - 7);
                expect(buckets[0].getMinutes()).to.equal(0);
            });
            it("returns a correct date an hour after the first", function () {
                expect(buckets[1].getHours()).to.equal(new Date().getHours() - 6);
            });
            it("returns the last date that has the same hour as the current", function () {
                expect(buckets[7].getHours()).to.equal(new Date().getHours());
            });
        });
    });
});