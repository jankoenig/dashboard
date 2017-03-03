import * as chai from "chai";

import { createConvo } from "../../../models/conversation";
import { Log, LogProperties } from "../../../models/log";

import { TYPE_COMPOSITE } from "./Filters";
import { CompositeFilter } from "./Filters";
import { Filter } from "./Filters";

chai.use(require("chai-datetime"));
let expect = chai.expect;

const fullSessionID = "amzn1.echo-api.session.4ad25fd6-5287-4f09-a142-dfbad23c1ff9";
const fullUserID = "amzn1.ask.account.AE2GW6ZHVQYQG4ILBSOHWUXACSTTHENV426JX23R6PS2TBQBW5ZVHHTNETVCIBALJE77IRJKQ4OFBIHWAZTNCEZTLS3EY6V7TYQLXQEJZ2CH4LPXG2GL27D4VCJVZXIONQG6452LDN7IXVCJ3EBRBO2JYF3YCMHINQ4N7VS6NINYW3DR53W5GSQTYOFAHT6LVXFHIZCEAMZVB5I";

let requestProps: LogProperties = {
    payload: {
        request: {
            intent: {
                name: "Testing.Request.Intent"
            },
            type: "TestRequest"
        },
        session: {
            sessionId: fullSessionID,
            applicationId: "ABC123",
            user: {
                userId: fullUserID
            },
        },
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

class SuccessFilter implements Filter<any> {
    type = "Success";
    get filter(): (item: any) => boolean {
        return function (item: any): boolean {
            return true;
        };
    }
}

class FailFilter implements Filter<any> {
    type = "Fail";
    get filter(): (item: any) => boolean {
        return function (item: any): boolean {
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
            let convo = createConvo({
                request: new Log(requestProps),
                response: new Log(responseProps)
            });

            expect(filter.filter(convo)).to.be.true;
        });

        it("Tests it returns true with only true filters.", function () {
            let filter = new CompositeFilter([new SuccessFilter(), new SuccessFilter(), new SuccessFilter()]);
            let convo = createConvo({
                request: new Log(requestProps),
                response: new Log(responseProps)
            });

            expect(filter.filter(convo)).to.be.true;
        });

        it("Tests it returns false with one failing filter.", function () {
            let filter = new CompositeFilter([new SuccessFilter(), new FailFilter(), new SuccessFilter()]);
            let convo = createConvo({
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

        it("Tests returns an undefined from getFilter if not found.", function() {
            let success = new SuccessFilter();
            let fail = new FailFilter();
            let filter = new CompositeFilter([success, fail]);
            expect(filter.getFilter("Can not find.")).to.be.undefined;
        });

        it("Tests returns an undefined from getFilter if searching for undefined.", function() {
            let success = new SuccessFilter();
            let fail = new FailFilter();
            let filter = new CompositeFilter([success, fail]);

            expect(filter.getFilter(undefined)).to.be.undefined;
        });

        describe("Copy and replace", function () {
            let arr: Filter<any>[];
            let filter: CompositeFilter<any>;

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

        describe("Copy and Remove", function () {
            let arr: Filter<any>[];
            let filter: CompositeFilter<any>;

            before(function () {
                arr = [];
                for (let i = 0; i < 10; ++i) {
                    let success: SuccessFilter = new SuccessFilter();
                    success.type = success.type + i.toString();

                    arr.push(success);
                }

                filter = new CompositeFilter(arr);
            });

            it("Tests the copy and remove method from beginning.", function () {
                let newFilter = filter.copyAndRemove(arr[0].type);

                expect(newFilter.getFilter(arr[0].type)).to.not.exist;
            });

            it("Tests the copy and remove method from middle.", function () {
                let newFilter = filter.copyAndRemove(arr[arr.length - 4].type);

                expect(newFilter.getFilter(arr[arr.length - 4].type)).to.not.exist;
            });

            it("Tests the copy and remove method from end.", function () {
                let newFilter = filter.copyAndRemove(arr[arr.length - 1].type);

                expect(newFilter.getFilter(arr[arr.length - 1].type)).to.not.exist;
            });

            it("Tests the copy and remove method does not remove anything if it doesn't exist.", function () {
                let newFilter = filter.copyAndRemove("Doesn't exist.");
                expect(newFilter.type).to.deep.equal(filter.type);
                expect(newFilter.filters).to.deep.equal(filter.filters);
            });
        });
    });
});