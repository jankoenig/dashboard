import * as chai from "chai";
import * as sinon from "sinon";

import configureMockStore, { IStore } from "redux-mock-store";
import thunk from "redux-thunk";

import { FETCH_LOGS_REQUEST, SET_LOGS } from "../constants";
import Log from "../models/log";
import LogQuery from "../models/log-query";
import Source from "../models/source";
import { LogQueryEvent } from "../reducers/log";
import LogsService from "../services/log";
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
            store = mockStore(initialState);
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

            describe("Success", function () {
                let serviceStub: Sinon.SinonStub;

                before(function () {
                    serviceStub = sinon.stub(LogsService, "getLogs").returns(new Promise((resolve, reject) => {
                        resolve(mockPayload);
                    }));
                });

                afterEach(function () {
                    serviceStub.reset();
                });

                after(function () {
                    serviceStub.restore();
                });

                it("retrieves the logs", function () {
                    return store.dispatch(log.getLogs(source)).then(function (logs: Log[]) {
                        expect(logs).to.deep.equal(mockPayload);

                        let actions: any[] = store.getActions();

                        expect(actions).to.have.length(3);
                        expect(actions[0].type).to.equal(FETCH_LOGS_REQUEST);
                        expect(actions[1].type).to.equal(SET_LOGS);
                    });
                });

                it("Tests that the proper dispatches were thrown on success.", function () {
                    return store.dispatch(log.retrieveLogs(query)).then(function (logs: Log[]) {
                        let actions: any[] = store.getActions();

                        expect(actions).to.have.length(3); // Two fetching dispatches and set logs.
                        expect(actions[0].type).to.equal(FETCH_LOGS_REQUEST);
                        expect(actions[0].fetching).to.equal(true);

                        expect(actions[1].type).to.equal(SET_LOGS);
                        expect(actions[1].logs).to.deep.equal(logs);
                        expect(actions[1].append).to.equal(false);

                        expect(actions[2].type).to.equal(FETCH_LOGS_REQUEST);
                        expect(actions[2].fetching).to.equal(false);
                    });
                });
            });

            describe("Failure", function () {

                let serviceStub: Sinon.SinonStub;

                before(function () {
                    serviceStub = sinon.stub(LogsService, "getLogs").returns(new Promise((resolve, reject) => {
                        reject(new Error("Error thrown per requirements of the test."));
                    }));
                });

                afterEach(function () {
                    serviceStub.reset();
                });

                after(function () {
                    serviceStub.restore();
                });

                it("Tests that the proper dispatches were thrown on failure.", function () {
                    return store.dispatch(log.retrieveLogs(query)).catch(function (err: Error) {
                        let actions: any[] = store.getActions();

                        expect(err).to.not.be.undefined;

                        expect(actions).to.have.length(2); // Two fetching dispatches and set logs.
                        expect(actions[0].type).to.equal(FETCH_LOGS_REQUEST);
                        expect(actions[0].fetching).to.equal(true);

                        expect(actions[1].type).to.equal(FETCH_LOGS_REQUEST);
                        expect(actions[1].fetching).to.equal(false);
                    });
                });
            });
        });

        describe("NextPage", function () {
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

            describe("Success", function () {
                let serviceStub: Sinon.SinonStub;

                let originalQuery: LogQueryEvent;

                let nextPage: Log[] = dummyLogs(5);

                before(function () {
                    serviceStub = sinon.stub(LogsService, "getLogs").returns(new Promise((resolve, reject) => {
                        resolve(nextPage);
                    }));

                    originalQuery = {
                        logs: mockPayload,
                        query: query
                    };
                });

                afterEach(function () {
                    serviceStub.reset();
                });

                after(function () {
                    serviceStub.restore();
                });

                it("Checks the dispatches were shown.", function () {
                    return store.dispatch(log.nextPage(originalQuery, 50)).then(function (results: log.PageResults) {
                        let actions: any[] = store.getActions();

                        expect(actions).to.have.length(3); // Two fetching dispatches and set logs.
                        expect(actions[0].type).to.equal(FETCH_LOGS_REQUEST);
                        expect(actions[0].fetching).to.equal(true);

                        expect(actions[1].type).to.equal(SET_LOGS);
                        expect(actions[1].logs).to.deep.equal(results.totalLogs);
                        expect(actions[1].query).to.deep.equal(originalQuery.query);
                        expect(actions[1].append).to.equal(false);

                        expect(actions[2].type).to.equal(FETCH_LOGS_REQUEST);
                        expect(actions[2].fetching).to.equal(false);
                    });
                });

                it("Checks the results of the next page.", function () {
                    return store.dispatch(log.nextPage(originalQuery, 50)).then(function (results: log.PageResults) {
                        const merged = mockPayload.slice().concat(nextPage);
                        expect(merged).to.deep.equal(results.totalLogs);
                        expect(nextPage).to.deep.equal(results.newLogs);
                        expect(mockPayload).to.deep.equal(results.oldLogs);
                    });
                });
            });

            describe("Failure", function () {
                let serviceStub: Sinon.SinonStub;

                let originalQuery: LogQueryEvent;

                before(function () {
                    serviceStub = sinon.stub(LogsService, "getLogs").returns(new Promise((resolve, reject) => {
                        reject(new Error("Error out as a requirement for the test."));
                    }));

                    originalQuery = {
                        logs: mockPayload,
                        query: new LogQuery({
                            source: source,
                            startTime: sevenDaysAgo,
                            endTime: today
                        })
                    };
                });

                afterEach(function () {
                    serviceStub.reset();
                });

                after(function () {
                    serviceStub.restore();
                });

                it("Checks the dispatches were shown.", function () {
                    return store.dispatch(log.nextPage(originalQuery, 50)).catch(function (err: Error) {
                        let actions: any[] = store.getActions();

                        expect(actions).to.have.length(2); // Two fetching dispatches.
                        expect(actions[0].type).to.equal(FETCH_LOGS_REQUEST);
                        expect(actions[0].fetching).to.equal(true);

                        expect(actions[1].type).to.equal(FETCH_LOGS_REQUEST);
                        expect(actions[1].fetching).to.equal(false);
                    });
                });

                it("Checks the error is not null.", function() {
                    return store.dispatch(log.nextPage(originalQuery, 50)).catch(function (err: Error) {
                        expect(err).to.exist;
                    });
                });
            });
        });

        describe("FindLatest", function () {
            let sevenDaysAgo: Date;
            let yesterday: Date;
            let query: LogQuery;

            before(function () {
                sevenDaysAgo = new Date();
                sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
                yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);

                query = new LogQuery({
                    source: source,
                    startTime: sevenDaysAgo,
                    endTime: yesterday
                });
            });

            describe("Success", function () {
                let serviceStub: Sinon.SinonStub;

                let originalQueryEvent: LogQueryEvent;

                let nextPage: Log[] = dummyLogs(5);

                before(function () {
                    serviceStub = sinon.stub(LogsService, "getLogs").returns(new Promise((resolve, reject) => {
                        resolve(nextPage);
                    }));

                    originalQueryEvent = {
                        logs: mockPayload,
                        query: query
                    };
                });

                afterEach(function () {
                    serviceStub.reset();
                });

                after(function () {
                    serviceStub.restore();
                });

                it("Tests the appropriate actions were dispatched.", function () {
                    const today = new Date();
                    return store.dispatch(log.findLatest(originalQueryEvent)).then(function (results: log.PageResults) {
                        let actions: any[] = store.getActions();

                        expect(actions).to.have.length(3); // Two fetching dispatches and set logs.
                        expect(actions[0].type).to.equal(FETCH_LOGS_REQUEST);
                        expect(actions[0].fetching).to.equal(true);

                        expect(actions[1].type).to.equal(SET_LOGS);
                        expect(actions[1].logs).to.deep.equal(results.totalLogs);
                        expect(actions[1].append).to.equal(false);

                        // Test the query was updated.
                        const actionsQuery: LogQuery = actions[1].query;
                        const query: LogQuery = originalQueryEvent.query;

                        expect(actionsQuery.source).to.deep.equal(query.source);
                        expect(actionsQuery.startTime).to.equalDate(query.startTime);
                        expect(actionsQuery.endTime).to.equalDate(today);

                        expect(actions[2].type).to.equal(FETCH_LOGS_REQUEST);
                        expect(actions[2].fetching).to.equal(false);
                    });
                });

                it ("Tests the proper results were returned..", function() {
                    const joined: Log[] = nextPage.slice().concat(mockPayload);

                    return store.dispatch(log.findLatest(originalQueryEvent)).then(function (results: log.PageResults) {
                        expect(results.totalLogs).to.deep.equal(joined);
                        expect(results.newLogs).to.deep.equal(nextPage);
                        expect(results.oldLogs).to.deep.equal(mockPayload);
                    });
                });
            });

            describe("Failure", function () {
                let serviceStub: Sinon.SinonStub;

                let originalQuery: LogQueryEvent;

                before(function () {
                    serviceStub = sinon.stub(LogsService, "getLogs").returns(new Promise((resolve, reject) => {
                        reject(new Error("Error out as a requirement for the test."));
                    }));

                    originalQuery = {
                        logs: mockPayload,
                        query: new LogQuery({
                            source: source,
                            startTime: sevenDaysAgo,
                            endTime: yesterday
                        })
                    };
                });

                afterEach(function () {
                    serviceStub.reset();
                });

                after(function () {
                    serviceStub.restore();
                });

                it("Checks the dispatches were shown.", function () {
                    return store.dispatch(log.findLatest(originalQuery)).catch(function (logs: Log[]) {
                        let actions: any[] = store.getActions();

                        expect(actions).to.have.length(2); // Two fetching dispatches.
                        expect(actions[0].type).to.equal(FETCH_LOGS_REQUEST);
                        expect(actions[0].fetching).to.equal(true);

                        expect(actions[1].type).to.equal(FETCH_LOGS_REQUEST);
                        expect(actions[1].fetching).to.equal(false);
                    });
                });
            });
        });

        describe("Query tests", function () {

            let initialState: any;
            let store: any;
            let source: Source;
            let serviceStub: Sinon.SinonStub;

            before(function () {
                source = new Source({
                    name: "Test"
                });
                serviceStub = sinon.stub(LogsService, "getLogs").returns(new Promise((resolve, reject) => {
                    resolve(mockPayload);
                }));
            });

            beforeEach(function () {
                initialState = {};
                store = mockStore(initialState);
            });

            afterEach(function () {
                serviceStub.reset();
            });

            after(function () {
                serviceStub.restore();
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