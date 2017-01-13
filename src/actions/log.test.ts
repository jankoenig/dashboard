import * as chai from "chai";
import * as fetchMock from "fetch-mock";
import configureMockStore, { IStore } from "redux-mock-store";
import thunk from "redux-thunk";

import { FETCH_LOGS_REQUEST, SET_LOGS } from "../constants";
import Log from "../models/log";
import LogQuery from "../models/log-query";
import Source from "../models/source";
import { dummyLogs } from "../utils/test";
import * as log from "./log";

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

chai.use(require("chai-datetime"));
let expect = chai.expect;

describe("Log Actions", function () {
    describe("getLogs", function () {
        const mockPayload: Log[] = dummyLogs(6);
        const initialState: any = {};
        const source: Source = new Source({
            name: "Test"
        });
        let store: IStore<any>;

        beforeEach(function () {
            fetchMock.get("*", {
                "data": mockPayload
            });

            store = mockStore(initialState);
        });

        afterEach(function () {
            fetchMock.restore();
        });

        it("retrieves the logs", function () {
            return store.dispatch(log.getLogs(source)).then(function () {

                let actions: any[] = store.getActions();

                expect(actions).to.have.length(3);
                expect(actions[0].type).to.equal(FETCH_LOGS_REQUEST);
                expect(actions[1].type).to.equal(SET_LOGS);
            });
        });

        describe("RetrieveLogs", function () {

            let sevenDaysAgo: Date;
            let today: Date;
            let query: LogQuery;

            before(function () {
                sevenDaysAgo = new Date();
                sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
                today = new Date();

                query = new LogQuery({
                    source: source,
                    startTime: sevenDaysAgo,
                    endTime: today
                });
            });

            it("Tests that the proper dispatches were thrown on success.", function () {
                return store.dispatch(log.retrieveLogs(query)).then(function (logs: Log[]) {
                    let actions: any[] = store.getActions();

                    expect(actions).to.have.length(3); // Two fetching dispatches and set logs.
                    expect(actions[0].type).to.equal(FETCH_LOGS_REQUEST);
                    expect(actions[0].fetching).to.equal(true);

                    expect(actions[1].type).to.equal(SET_LOGS);
                    expect(actions[1].logs).to.have.length(logs.length);
                    expect(actions[1].append).to.equal(false);

                    expect(actions[2].type).to.equal(FETCH_LOGS_REQUEST);
                    expect(actions[2].fetching).to.equal(false);
                });
            });
        });

        describe("Query tests", function () {

            let initialState: any;
            let store: any;
            let source: Source;

            before(function () {
                source = new Source({
                    name: "Test"
                });
            });

            beforeEach(function () {
                initialState = {};
                store = mockStore(initialState);
            });

            it("Sets the appropriate source for the query.", function () {
                return store.dispatch(log.getLogs(source)).then(function () {
                    let actions: any[] = store.getActions();

                    let setLogAction: log.SetLogsAction = actions[1] as log.SetLogsAction;
                    let query = setLogAction.query;
                    expect(query).to.not.be.undefined;
                    expect(query.source).to.equal(source);
                });
            });

            it("Sets the appropriate default date query", function () {
                let sevenDaysAgo: Date = new Date();
                sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

                return store.dispatch(log.getLogs(source)).then(function () {

                    let actions: any[] = store.getActions();

                    let setLogAction: log.SetLogsAction = actions[1] as log.SetLogsAction;

                    let query = setLogAction.query;

                    expect(query).to.not.be.undefined;
                    expect(query.startTime).to.not.be.undefined;
                    expect(query.startTime).to.equalDate(sevenDaysAgo);
                    expect(query.endTime).to.equalDate(new Date());
                });
            });

            it("Sets the appropriate overridden date query.", function () {
                let startDate = new Date();
                startDate.setDate(startDate.getDay() - 8);

                let endDate = new Date();

                return store.dispatch(log.getLogs(source, startDate, endDate)).then(function () {
                    let actions: any[] = store.getActions();

                    let setLogAction: log.SetLogsAction = actions[1] as log.SetLogsAction;

                    let query = setLogAction.query;

                    expect(query).to.not.be.undefined;
                    expect(query.startTime).to.not.be.undefined;
                    expect(query.startTime).to.equalDate(startDate);
                    expect(query.endTime).to.not.be.undefined;
                    expect(query.endTime).to.equalDate(endDate);
                });
            });
        });
    });
});