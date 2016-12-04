import { expect } from "chai";

import DateUtil from "./date";

describe("DateUtil", function() {
    describe("daysAgo", function() {
        it("returns a date from two days ago", function() {
            let now = new Date();
            let previousDate = DateUtil.daysAgo(2);

            expect(previousDate.getDate()).to.equal(now.getDate() - 2);
        });
    });
});