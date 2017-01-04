import { expect } from "chai";

import { TimeSeriesDatum } from "../models/time-series";
import DataUtil from "./data";

describe("DataUtil", function() {
    describe("convertToTimeSeries", function() {
        describe("with data in the give range", function() {
            let startDate = new Date();
            startDate.setDate(18);
            let endDate = new Date();
            endDate.setDate(19);

            let datum = { timestamp: endDate };
            let data = DataUtil.convertToTimeSeries("hours", startDate, endDate, [datum]);

            it("returns the correct number of data", function() {
                expect(data).to.have.length(25);
            });
            it("organized the data correctly", function() {
                expect(data[0].data).to.have.length(0);
                expect(data[24].data).to.have.length(1);
            });
        });
    });
    describe("getDayTicks", function() {
        it("returns the number of ticks", function() {
            let startDate = new Date();
            startDate.setDate(12);
            let endDate = new Date();
            endDate.setDate(19);

            let start = new TimeSeriesDatum({
                date: startDate,
                data: []
            });

            let end = new TimeSeriesDatum({
                date: endDate,
                data: []
            });

            let ticks = DataUtil.getDayTicks([start, end]);

            expect(ticks).to.have.length(7);
        });
    });
});
