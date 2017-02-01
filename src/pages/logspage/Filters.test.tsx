import * as chai from "chai";

import Conversation from "../../models/conversation";
import { Log, LogProperties } from "../../models/log";
import StackTrace from "../../models/stack-trace";
import { dummyOutputs } from "../../utils/test";

import { TYPE_COMPOSITE, TYPE_DATE, TYPE_EXCEPTION, TYPE_ID, TYPE_INTENT, TYPE_LOG_LEVEL, TYPE_REQUEST } from "./Filters";
import { CompositeFilter, DateFilter, ExceptionFilter, IDFilter, IntentFilter, LogLevelFilter, RequestFilter } from "./Filters";
import { FilterType } from "./Filters";

chai.use(require("chai-datetime"));
let expect = chai.expect;

let requestProps: LogProperties = {
    payload: {
        request: {
            intent: {
                name: "Testing Request Intent"
            },
            type: "TestRequest"
        }
    },
    stack: "Request Test Stack",
    log_type: "DEBUG",
    source: "Source123",
    transaction_id: "TestTransactionID",
    timestamp: new Date(),
    tags: ["Tag1, Tag2, Tag3, Tag4"],
    id: "LogID1234567890"
};

let responseProps: LogProperties = {
    payload: "Response Payload!",
    stack: "Response Test Stack",
    log_type: "DEBUG",
    source: "Source123",
    transaction_id: "TestTransactionID",
    timestamp: new Date(),
    tags: ["Tag1, Tag2, Tag3, Tag4"],
    id: "LogID0987654321"
};

class SuccessFilter implements FilterType {
    type = "Success";
    get filter(): (item: Conversation) => boolean {
        return function (item: Conversation): boolean {
            return true;
        };
    }
}

class FailFilter implements FilterType {
    type = "Fail";
    get filter(): (item: Conversation) => boolean {
        return function (item: Conversation): boolean {
            return false;
        };
    }
}

describe("Filters.tsx", function () {

    describe("CompositeFilter", function () {
        it("Tests type attribute is not undefined", function () {
            let filter = new CompositeFilter([]);
            expect(filter.type).to.equal(TYPE_COMPOSITE);
        });

        it("Tests filter attribute is not undefined", function () {
            let filter = new CompositeFilter([]);
            expect(filter.filter).to.not.be.undefined;
            expect(filter.filter).to.not.be.null;
        });

        it("Tests it returns true with empty filters.", function () {
            let filter = new CompositeFilter([]);
            let convo = new Conversation({
                request: new Log(requestProps),
                response: new Log(responseProps)
            });

            expect(filter.filter(convo)).to.be.true;
        });

        it("Tests it returns true with only true filters.", function () {
            let filter = new CompositeFilter([new SuccessFilter(), new SuccessFilter(), new SuccessFilter()]);
            let convo = new Conversation({
                request: new Log(requestProps),
                response: new Log(responseProps)
            });

            expect(filter.filter(convo)).to.be.true;
        });

        it("Tests it returns false with one failing filter.", function () {
            let filter = new CompositeFilter([new SuccessFilter(), new FailFilter(), new SuccessFilter()]);
            let convo = new Conversation({
                request: new Log(requestProps),
                response: new Log(responseProps)
            });

            expect(filter.filter(convo)).to.be.false;
        });

        it("Tests it returns the appropriate filter from getFilter by type.", function () {
            let success = new SuccessFilter();
            let fail = new FailFilter();
            let filter = new CompositeFilter([success, fail]);
            expect(filter.getFilter(success.type).type).to.equal(success.type);
            expect(filter.getFilter(fail.type).type).to.equal(fail.type);
        });

        describe("Copy and replace", function () {
            let arr: FilterType[];
            let filter: CompositeFilter;

            before(function () {
                arr = [];
                for (let i = 0; i < 10; ++i) {
                    let success: SuccessFilter = new SuccessFilter();
                    success.type = success.type + i.toString();

                    arr.push(success);
                }

                filter = new CompositeFilter(arr);
            });

            it("Tests the copy and replace method add.", function () {
                let newSuccess = new SuccessFilter();
                newSuccess.type = "Brand New Type";

                let newFilter = filter.copyAndAddOrReplace(newSuccess);

                expect(newFilter.getFilter("Brand New Type")).to.equal(newSuccess);
            });

            it("Tests the replace at beginning.", function () {
                let newSuccess = new SuccessFilter();
                newSuccess.type = arr[0].type;

                let newFilter = filter.copyAndAddOrReplace(newSuccess);

                expect(newFilter.getFilter(newSuccess.type)).to.equal(newSuccess);
                expect(newFilter.getFilter(arr[0].type)).to.not.equal(arr[0]);
            });

            it("Tests the replace in middle.", function () {
                let newSuccess = new SuccessFilter();
                newSuccess.type = arr[5].type;

                let newFilter = filter.copyAndAddOrReplace(newSuccess);

                expect(newFilter.getFilter(newSuccess.type)).to.equal(newSuccess);
                expect(newFilter.getFilter(arr[0].type)).to.not.equal(arr[5]);
            });

            it("Tests the replace at end.", function () {
                let newSuccess = new SuccessFilter();
                newSuccess.type = arr[arr.length - 1].type;

                let newFilter = filter.copyAndAddOrReplace(newSuccess);

                expect(newFilter.getFilter(newSuccess.type)).to.equal(newSuccess);
                expect(newFilter.getFilter(arr[0].type)).to.not.equal(arr[arr.length - 1]);
            });
        });
    });

    describe("LogLevelFilter", function () {
        it("Tests type attribute is not undefined", function () {
            let filter = new LogLevelFilter("DEBUG");
            expect(filter.type).to.equal(TYPE_LOG_LEVEL);
        });

        it("Tests filter attribute is not undefined", function () {
            let filter = new LogLevelFilter("DEBUG");
            expect(filter.filter).to.not.be.undefined;
        });

        it("Tests the filter will return true with a positive response.", function () {
            let filter = new LogLevelFilter("DEBUG");

            let convo = new Conversation({
                request: new Log(requestProps),
                response: new Log(responseProps),
                outputs: dummyOutputs(6)
            });

            expect(filter.filter(convo)).to.be.true;
        });

        it("Tests the filter will return false when neither log is correct.", function () {
            let filter = new LogLevelFilter("ERROR");

            let convo = new Conversation({
                request: new Log(requestProps),
                response: new Log(responseProps)
            });

            expect(filter.filter(convo)).to.be.false;
        });

        it("Tests the filter will return true when searching for undefined log type.", function () {
            let filter = new LogLevelFilter(undefined);

            let convo = new Conversation({
                request: new Log(requestProps),
                response: new Log(responseProps)
            });

            expect(filter.filter(convo)).to.be.true;
        });

        it("Tests the filter will return true when searching for empty log type.", function () {
            let filter = new LogLevelFilter("");

            let convo = new Conversation({
                request: new Log(requestProps),
                response: new Log(responseProps)
            });

            expect(filter.filter(convo)).to.be.true;
        });

        it("Tests the filter will return false when given an empty conversation.", function () {
            let filter = new LogLevelFilter("DEBUG");

            expect(filter.filter(undefined)).to.be.false;
        });
    });

    describe("IDFilter", function () {
        let convo = new Conversation({
            request: new Log(requestProps),
            response: new Log(responseProps)
        });

        it("Tests the type attribute is not undefined.", function () {
            let filter = new IDFilter("1234");
            expect(filter.type).to.equal(TYPE_ID);
        });

        it("Tests the filter attribute is not undefined.", function () {
            let filter = new IDFilter("1234");
            expect(filter.filter).to.not.be.undefined;
            expect(filter.filter).to.not.be.null;
        });

        it("Tests the fitler attribute to return true with a good ID.", function () {
            let filter = new IDFilter(convo.id.substr(0)); // So it creates a new string and can't use a reference compare.
            expect(filter.filter(convo)).to.be.true;
        });

        it("Tests the filter attribute to return true with a partial ID at the start.", function () {
            let filter = new IDFilter(convo.id.substr(0, 2));
            expect(filter.filter(convo)).to.be.true;
        });

        it("Tests the filter attribute to return true with a partial ID at the end.", function () {
            let filter = new IDFilter(convo.id.substr(3));
            expect(filter.filter(convo)).to.be.true;
        });

        it("Tests the filter attribute to return true with a partial ID in the middle.", function () {
            let filter = new IDFilter(convo.id.substr(2, 5));
            expect(filter.filter(convo)).to.be.true;
        });

        it("Tests the filter attribute to return true with an undefined ID.", function () {
            let filter = new IDFilter(undefined);
            expect(filter.filter(convo)).to.be.true;
        });

        it("Tests the filter attribute to return true with a empty ID.", function () {
            let filter = new IDFilter("");
            expect(filter.filter(convo)).to.be.true;
        });

        it("Tests the filter attribute to return false with an ID not in it.", function () {
            let filter = new IDFilter("Nope");
            expect(filter.filter(convo)).to.be.false;
        });

        it("Tests the filter attribute to return false with an undefined convo.", function () {
            let filter = new IDFilter(convo.id.substr(0));
            expect(filter.filter(undefined)).to.be.false;
        });
    });

    describe("DateFilter", function () {
        let convo: Conversation;

        before(function () {
            requestProps.timestamp.setFullYear(2016, 12, 15);
            responseProps.timestamp.setFullYear(2016, 12, 15);
            convo = new Conversation({
                request: new Log(requestProps),
                response: new Log(responseProps)
            });
        });

        it("Tests the type attribute is not undefined.", function () {
            let filter = new DateFilter(new Date());
            expect(filter.type).to.equal(TYPE_DATE);
        });

        it("Tests the filter attribute is not undefined.", function () {
            let filter = new DateFilter(new Date());
            expect(filter.filter).to.not.be.undefined;
            expect(filter.filter).to.not.be.null;
        });

        it("Tests the getStartDate property returns the appropriate value.", function () {
            let startDate = new Date(2016, 12, 14);
            let filter = new DateFilter(startDate, new Date(2016, 12, 16));
            expect(filter.startDate).to.equalDate(startDate);
        });

        it("Tests the getEndDate property returns the appropriate value.", function () {
            let endDate = new Date(2016, 12, 16);
            let filter = new DateFilter(new Date(2016, 12, 14), endDate);
            expect(filter.endDate).to.equalDate(endDate);
        });

        it("Tests the filter will return true if between the start and end date.", function () {
            let filter = new DateFilter(new Date(2016, 12, 14), new Date(2016, 12, 16));
            expect(filter.filter(convo)).to.be.true;
        });

        it("Tests the filter will return true if the convo happens after the start date with undefined end.", function () {
            let filter = new DateFilter(new Date(2016, 12, 14));
            expect(filter.filter(convo)).to.be.true;
        });

        it("Tests the filter will return true if the convo happens before the end date with undefined end.", function () {
            let filter = new DateFilter(undefined, new Date(2016, 12, 16));
            expect(filter.filter(convo)).to.be.true;
        });

        it("Tests the filter will return false if the convo happens before the start date with undefined end.", function () {
            let filter = new DateFilter(new Date(2016, 12, 16));
            expect(filter.filter(convo)).to.be.false;
        });

        it("Tests the filter will return false if the convo happens before the end date with undefined start.", function () {
            let filter = new DateFilter(undefined, new Date(2016, 12, 14));
            expect(filter.filter(convo)).to.be.false;
        });

        it("Tests the filter will return true if no start or end are defined.", function () {
            let filter = new DateFilter();
            expect(filter.filter(convo)).to.be.true;
        });

        it("Tests the filter will return false if between the start and end date.", function () {
            let filter = new DateFilter(new Date(2016, 12, 14), new Date(2016, 12, 16));
            expect(filter.filter(undefined)).to.be.false;
        });

        it("Tests the date filter will return true if the start date is equal to the start date.", function () {
            let filter = new DateFilter(new Date(requestProps.timestamp));
            expect(filter.filter(convo)).to.be.true;
        });

        it("Tests the date filter will return true if the start date is equal to the end date.", function () {
            let filter = new DateFilter(undefined, new Date(requestProps.timestamp));
            expect(filter.filter(convo)).to.be.true;
        });

        it("Tests the date filter will return true if the start date is equal to the end date.", function () {
            let startDate = new Date(2016, 12, 15, 0, 0, 0);
            let endDate = new Date(2016, 12, 15, 23, 59, 59);
            let filter = new DateFilter(startDate, endDate);
            expect(filter.filter(convo)).to.be.true;
        });
    });

    describe("Intent filter", function () {
        let convo: Conversation;

        before(function () {
            convo = new Conversation({
                request: new Log(requestProps),
                response: new Log(responseProps)
            });
        });

        it("Tests the intent filter is the correct type.", function () {
            const filter: IntentFilter = new IntentFilter("ERROR");
            expect(filter.type).to.equal(TYPE_INTENT);
        });

        it("Tests the intent filter returns a filter.", function () {
            const filter: IntentFilter = new IntentFilter("ERROR");
            expect(filter.filter).to.exist;
        });

        it("Tests a true filter with undefined", function () {
            const filter: IntentFilter = new IntentFilter(undefined);
            expect(filter.filter(convo)).to.be.true;
        });

        it("Tests a true filter", function () {
            const filter: IntentFilter = new IntentFilter(convo.intent);
            expect(filter.filter(convo)).to.be.true;
        });

        it("Tests a like filter from the beginning", function () {
            const filter: IntentFilter = new IntentFilter(convo.intent.substr(0, 2));
            expect(filter.filter(convo)).to.be.true;
        });

        it("Tests a like filter from the end", function () {
            const filter: IntentFilter = new IntentFilter(convo.intent.substr(convo.intent.length - 2));
            expect(filter.filter(convo)).to.be.true;
        });

        it("Tests a like filter from the middle", function () {
            const filter: IntentFilter = new IntentFilter(convo.intent.substr(2, convo.intent.length - 2));
            expect(filter.filter(convo)).to.be.true;
        });

        it("Tests a false filter", function () {
            const filter: IntentFilter = new IntentFilter("Really weird intent that it could not accidentally have.");
            expect(filter.filter(convo)).to.be.false;
        });

        it("Tests a true filter", function () {
            const filter: IntentFilter = new IntentFilter(convo.intent);
            expect(filter.filter(undefined)).to.be.false;
        });

        it("Tests a false filter when convo doesn't have an intent", function () {
            const newConvo = new Conversation({
                request: new Log(responseProps),
                response: new Log(responseProps)
            });

            const filter: IntentFilter = new IntentFilter("Test Convo");
            expect(filter.filter(newConvo)).to.be.false;
        });
    });

    describe("Request filter", function () {
        let convo: Conversation;

        before(function () {
            convo = new Conversation({
                request: new Log(requestProps),
                response: new Log(responseProps)
            });
        });

        it("Tests the request filter returns the correct type.", function() {
            const filter = new RequestFilter();
            expect(filter.type).to.equal(TYPE_REQUEST);
        });

        it ("Tests the request filter returns the correct value with default constructor", function() {
            const filter = new RequestFilter();
            expect(filter.filter(convo)).to.be.true;
        });

        it ("Tests the request filter returns the correct value when undefined is passed in.", function() {
            const filter = new RequestFilter();
            expect(filter.filter(undefined)).to.be.true;
        });

        it ("Tests the request filter returns the correct value when request exists.", function() {
            const filter = new RequestFilter("TestRequest");
            expect(filter.filter(convo)).to.be.true;
        });

        it ("Tests the request filter returns the correct value when request exists and with partial value.", function() {
            const filter = new RequestFilter("estReques");
            expect(filter.filter(convo)).to.be.true;
        });

        it ("Tests the request filter returns the correct value when request does not exist.", function() {
            const filter = new RequestFilter("Does not exist request");
            expect(filter.filter(convo)).to.be.false;
        });

        it ("Tests the request filter returns the correct value when there is no type.", function() {
            const filter = new RequestFilter("TestRequest");
            const newConvo = new Conversation({
                request: new Log(responseProps), // Response doesn't have a type so we'll just use that.
                response: new Log(responseProps)
            });

            expect(filter.filter(newConvo)).to.be.false;
        });
    });

    describe("Has Exception filter", function () {

        it("Tests the Exception Filter returns the correct type.", function () {
            const filter: ExceptionFilter = new ExceptionFilter();
            expect(filter.type).to.equal(TYPE_EXCEPTION);
        });

        it("Tests the Exception Filter returns correct value with default constructor and exception exists.", function () {
            const filter: ExceptionFilter = new ExceptionFilter();
            const trace: StackTrace = new StackTrace({
                id: "trace0",
                timestamp: new Date(),
                raw: "Really long stack trace",
                message: "Stack trace message",
                elements: []
            });

            const newConvo = new Conversation({
                request: new Log(responseProps),
                response: new Log(responseProps),
                stackTraces: [trace]
            });

            expect(filter.filter(newConvo)).to.be.true;
        });

        it("Tests the Exception Filter returns correct value with default constructor and exception does not exist.", function () {
            const filter: ExceptionFilter = new ExceptionFilter();
            const newConvo = new Conversation({
                request: new Log(responseProps),
                response: new Log(responseProps)
            });

            expect(filter.filter(newConvo)).to.be.false;
        });
    });
});