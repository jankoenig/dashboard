import * as chai from "chai";
import * as fetchMock from "fetch-mock";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";

import { FETCH_LOGS_REQUEST, SET_LOGS } from "../constants";
import { dummyLogs } from "../utils/test";
import * as log from "./log";

import Source from "../models/source";

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

chai.use(require("chai-datetime"));
let expect = chai.expect;

describe("Log Actions", function () {
    describe("getLogs", function () {

        let mockPayload = dummyLogs(6);

        beforeEach(function () {
            fetchMock.get("*", {
                "data": mockPayload
            });
        });

        afterEach(function () {
            fetchMock.restore();
        });

        it("retrieves the logs", function (done) {

            let initialState = {};
            let store = mockStore(initialState);
            let source = new Source({
                name: "Test"
            });

            store.dispatch(log.getLogs(source)).then(function () {

                let actions: any[] = store.getActions();

                expect(actions).to.have.length(2);
                expect(actions[0].type).to.equal(FETCH_LOGS_REQUEST);
                expect(actions[1].type).to.equal(SET_LOGS);
                done();
            });
        });

        it("Sets the appropriate default query", function () {
            let initialState = {};
            let store = mockStore(initialState);
            let source = new Source({
                name: "Test"
            });

            let sevenDaysAgo: Date = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

            return store.dispatch(log.getLogs(source)).then(function () {

                let actions: any[] = store.getActions();

                let setLogAction: log.SetLogsAction = actions[1] as log.SetLogsAction;

                let query = setLogAction.query;

                expect(query).to.not.be.undefined;
                expect(query.source).to.equal(source);
                expect(query.startTime).to.not.be.undefined;
                expect(query.startTime).to.equalDate(sevenDaysAgo);
            });
        });
    });
});