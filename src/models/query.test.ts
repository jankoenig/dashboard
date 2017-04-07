import * as chai from "chai";

import { EndTimeParameter, LimitParameter, Query, QueryParameter,  SortParameter, SourceParameter, StartTimeParameter, TimeParameter } from "./query";
import Source from "./source";

const expect = chai.expect;

class TestParameter implements QueryParameter {

    value: any;

    parameter: string;

    constructor(value: any, parameter: string) {
        this.value = value;
        this.parameter = parameter;
    }
}

describe("Query objects.", function() {
    describe("SourceParameter", function() {
        it ("Tests the query values are correct with a string key.", function() {
            const param: SourceParameter = new SourceParameter("ABC123");
            expect(param.value).to.equal("ABC123");
            expect(param.parameter).to.equal("source");
        });

        it ("Tests the secret key of a source is used for it's value.", function() {
            const source: Source = new Source({
                name: "Source",
                secretKey: "ABC123"
            });

            const param: SourceParameter = new SourceParameter(source);
            expect(param.value).to.equal("ABC123");
            expect(param.parameter).to.equal("source");
        });
    });

    describe("Time Parameter", function() {
        it ("Tests the time parameter uses ISO date as the value.", function() {
            const date: Date = new Date();
            const param: TimeParameter = new TimeParameter(date);

            expect(param.value).to.equal(date.toISOString());
            expect(param.parameter).to.equal("time");
        });

        describe("Start Time Paramter", function() {
            it ("Tests the start time parameter uses the correct name.", function() {
                const param: StartTimeParameter = new StartTimeParameter(new Date());

                expect(param.parameter).to.equal("start_time");
            });
        });

        describe("End Time Paramter", function() {
            it ("Tests the start time parameter uses the correct name.", function() {
                const param: EndTimeParameter = new EndTimeParameter(new Date());

                expect(param.parameter).to.equal("end_time");
            });
        });
    });

    describe("Limit Paramter", function() {
        it ("tests the Limit parameter contains the correct value and parameter name.", function() {
            const param: LimitParameter = new LimitParameter(123);
            expect(param.value).to.equal(123);
            expect(param.parameter).to.equal("limit");
        });
    });

    describe("Sort Parameter", function() {
        it("Tests the sort parameter contains the correct valueand parmaeter", function() {
            const param: SortParameter = new SortParameter("asc");
            expect(param.value).to.equal("asc");
            expect(param.parameter).to.equal("sortBy");
        });
    });

    describe("Query", function() {
        it ("Tests the query string is produced in appropriate order.", function() {
            const query: Query = new Query();
            query.add(new TestParameter("1", "p1"))
                .add(new TestParameter("2", "p2"))
                .add(new TestParameter(3, "p3"));

            expect(query.query()).to.equal("p1=1&p2=2&p3=3");
        });

        it ("Tests that the query json method produces the appropriate JSON.", function() {
            const query: Query = new Query();
            query.add(new TestParameter("1", "p1"))
                .add(new TestParameter(2, "p2"))
                .add(new TestParameter({ value1: "5", value2: 3 }, "p3"))
                .add(new TestParameter(true, "p4"));

            const jsonString = query.json();
            const jsonObj = JSON.parse(jsonString);
            expect(jsonObj.p1).to.equal("1");
            expect(jsonObj.p2).to.equal(2);
            expect(jsonObj.p3).to.deep.equal({ value1: "5", value2: 3 });
            expect(jsonObj.p4).to.equal(true);
        });
    });
});