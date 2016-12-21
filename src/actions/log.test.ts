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
    });
});