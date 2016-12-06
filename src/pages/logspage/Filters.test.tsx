import { expect } from "chai";

import Conversation from "../../models/conversation";
import { Log, LogProperties } from "../../models/log";
import * as Filters from "./Filters";

let requestProps: LogProperties = {
    payload: "Request Payload!",
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

describe("Filters.tsx", function() {

    describe("TypeFilter", function() {
        it ("Tests type attribute is not undefined", function() {
            let filter = new Filters.TypeFilter("DEBUG");
            expect(filter.type).to.not.be.undefined;
            expect(filter.type).to.not.be.null;
        });

        it ("Tests filter attribute is not undefined", function() {
            let filter = new Filters.TypeFilter("DEBUG");
            expect(filter.filter).to.not.be.undefined;
        });

        it ("Tests the filter will return true with a positive response.", function() {
            let filter = new Filters.TypeFilter("DEBUG");

            let convo = new Conversation({
                request: new Log(requestProps),
                response: new Log(responseProps)
            });

            expect(filter.filter(convo)).to.be.true;
        });

        it ("Tests the filter will return true when only the request is correct.", function() {
            let filter = new Filters.TypeFilter("DEBUG");

            requestProps.log_type = "DEBUG";
            responseProps.log_type = "INFO";

            let convo = new Conversation({
                request: new Log(requestProps),
                response: new Log(responseProps)
            });

            expect(filter.filter(convo)).to.be.true;
        });

        it ("Tests the filter will return true when only the response is correct.", function() {
            let filter = new Filters.TypeFilter("DEBUG");

            requestProps.log_type = "INFO";
            responseProps.log_type = "DEBUG";

            let convo = new Conversation({
                request: new Log(requestProps),
                response: new Log(responseProps)
            });

            expect(filter.filter(convo)).to.be.true;
        });

        it ("Tests the filter will return false when neither log is correct.", function() {
            let filter = new Filters.TypeFilter("DEBUG");

            requestProps.log_type = "INFO";
            responseProps.log_type = "INFO";

            let convo = new Conversation({
                request: new Log(requestProps),
                response: new Log(responseProps)
            });

            expect(filter.filter(convo)).to.be.false;
        });

        it ("Tests the filter will return true when searching for undefined log type.", function() {
            let filter = new Filters.TypeFilter(undefined);

            requestProps.log_type = "INFO";
            responseProps.log_type = "INFO";

            let convo = new Conversation({
                request: new Log(requestProps),
                response: new Log(responseProps)
            });

            expect(filter.filter(convo)).to.be.true;
        });

        it ("Tests the filter will return true when searching for empty log type.", function() {
            let filter = new Filters.TypeFilter("");

            requestProps.log_type = "INFO";
            responseProps.log_type = "INFO";

            let convo = new Conversation({
                request: new Log(requestProps),
                response: new Log(responseProps)
            });

            expect(filter.filter(convo)).to.be.true;
        });

        it ("Tests the filter will return false when given an empty conversation.", function() {
            let filter = new Filters.TypeFilter("DEBUG");

            expect(filter.filter(undefined)).to.be.false;
        });
    });

    describe("IDFilter", function() {
        let convo = new Conversation({
                request: new Log(requestProps),
                response: new Log(responseProps)
            });

        it("Tests the type attribute is not undefined.", function() {
            let filter = new Filters.IDFilter("1234");
            expect(filter.type).to.not.be.undefined;
            expect(filter.type).to.not.be.null;
        });

        it("Tests the filter attribute is not undefined.", function() {
            let filter = new Filters.IDFilter("1234");
            expect(filter.filter).to.not.be.undefined;
            expect(filter.filter).to.not.be.null;
        });

        it("Tests the fitler attribute to return true with a good ID.", function() {
            let filter = new Filters.IDFilter(convo.id.substr(0)); // So it creates a new string and can't use a reference compare.
            expect(filter.filter(convo)).to.be.true;
        });

        it("Tests the filter attribute to return true with a partial ID at the start.", function() {
            let filter = new Filters.IDFilter(convo.id.substr(0, 2));
            expect(filter.filter(convo)).to.be.true;
        });

        it("Tests the filter attribute to return true with a partial ID at the end.", function() {
            let filter = new Filters.IDFilter(convo.id.substr(3));
            expect(filter.filter(convo)).to.be.true;
        });

        it("Tests the filter attribute to return true with a partial ID in the middle.", function() {
            let filter = new Filters.IDFilter(convo.id.substr(2, 5));
            expect(filter.filter(convo)).to.be.true;
        });

        it("Tests the filter attribute to return true with an undefined ID.", function() {
            let filter = new Filters.IDFilter(undefined);
            expect(filter.filter(convo)).to.be.true;
        });

        it("Tests the filter attribute to return true with a empty ID.", function() {
            let filter = new Filters.IDFilter("");
            expect(filter.filter(convo)).to.be.true;
        });

        it("Tests the filter attribute to return false with an ID not in it.", function() {
            let filter = new Filters.IDFilter("Nope");
            expect(filter.filter(convo)).to.be.false;
        });

        it("Tests the filter attribute to return false with an undefined convo.", function() {
            let filter = new Filters.IDFilter(convo.id.substr(0));
            expect(filter.filter(undefined)).to.be.false;
        });
    });

    describe("DateFilter", function() {
        let convo: Conversation;

        before(function() {
            requestProps.timestamp.setFullYear(2016, 12, 15);
            responseProps.timestamp.setFullYear(2016, 12, 15);
            convo = new Conversation({
                request: new Log(requestProps),
                response: new Log(responseProps)
            });
        });

        it("Tests the type attribute is not undefined.", function() {
            let filter = new Filters.DateFilter(new Date());
            expect(filter.type).to.not.be.undefined;
            expect(filter.type).to.not.be.null;
        });

        it("Tests the filter attribute is not undefined.", function() {
            let filter = new Filters.DateFilter(new Date());
            expect(filter.filter).to.not.be.undefined;
            expect(filter.filter).to.not.be.null;
        });

        it("Tests the filter will return true if between the start and end date.", function() {
            let filter = new Filters.DateFilter(new Date(2016, 12, 14), new Date(2016, 12, 16));
            expect(filter.filter(convo)).to.be.true;
        });

        it("Tests the filter will return true if the convo happens after the start date with undefined end.", function() {
            let filter = new Filters.DateFilter(new Date(2016, 12, 14));
            expect(filter.filter(convo)).to.be.true;
        });

        it("Tests the filter will return true if the convo happens before the end date with undefined end.", function() {
            let filter = new Filters.DateFilter(undefined, new Date(2016, 12, 16));
            expect(filter.filter(convo)).to.be.true;
        });

        it("Tests the filter will return false if the convo happens before the start date with undefined end.", function() {
            let filter = new Filters.DateFilter(new Date(2016, 12, 16));
            expect(filter.filter(convo)).to.be.false;
        });

        it("Tests the filter will return false if the convo happens before the end date with undefined start.", function() {
            let filter = new Filters.DateFilter(undefined, new Date(2016, 12, 14));
            expect(filter.filter(convo)).to.be.false;
        });

        it("Tests the filter will return true if no start or end are defined.", function() {
            let filter = new Filters.DateFilter();
            expect(filter.filter(convo)).to.be.true;
        });

        it("Tests the filter will return false if between the start and end date.", function() {
            let filter = new Filters.DateFilter(new Date(2016, 12, 14), new Date(2016, 12, 16));
            expect(filter.filter(undefined)).to.be.false;
        });

        it ("Tests the date filter will return true if the start date is equal to the start date.", function() {
            let filter = new Filters.DateFilter(new Date(requestProps.timestamp));
            expect(filter.filter(convo)).to.be.true;
        });

        it ("Tests the date filter will return true if the start date is equal to the end date.", function() {
            let filter = new Filters.DateFilter(undefined, new Date(requestProps.timestamp));
            expect(filter.filter(convo)).to.be.true;
        });

        it ("Tests the date filter will return true if the start date is equal to the end date.", function() {
            let startDate = new Date(2016, 12, 15, 0, 0, 0);
            let endDate = new Date(2016, 12, 15, 23, 59, 59);
            let filter = new Filters.DateFilter(startDate, endDate);
            expect(filter.filter(convo)).to.be.true;
        });
    });
});