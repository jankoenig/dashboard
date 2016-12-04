import { expect } from "chai";

import DateUtil from "../utils/date";
import LogQuery from "./log-query";

describe("LogQuery", function () {
    describe("constructor", function () {
        it("sets the provided properties", function () {
            let endDate = new Date();
            let startDate = DateUtil.daysAgo(2);
            let source = "source";

            let logQueryProps = {
                startDate: startDate,
                endDate: endDate,
                source: source
            };

            let logQuery = new LogQuery(logQueryProps);

            expect(logQuery.startDate).to.equal(startDate);
            expect(logQuery.endDate).to.equal(endDate);
            expect(logQuery.source).to.equal(source);
        });
        it("sets the start date if one isn't provided", function () {
            let source = "source";

            let logQuery = new LogQuery({source: source});

            expect(logQuery.startDate).to.exist;
            expect(logQuery.source).to.equal(source);
            expect(logQuery.endDate).to.be.undefined;
        });
    });
});