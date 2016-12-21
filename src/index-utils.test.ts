import { expect } from "chai";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import * as sinon from "sinon";

import { FETCH_LOGS_REQUEST, SET_CURRENT_SOURCE } from "./constants";
import IndexUtils from "./index-utils";
import Source from "./models/source";
import source from "./services/source";
import { dummySources } from "./utils/test";

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe("Unit tests for the index-utils.ts", function () {

    let sources: Source[];
    let getSourceSpy: Sinon.SinonStub;

    before(function () {
        sources = dummySources(5);
        getSourceSpy = sinon.stub(source, "getSourcesObj", function () {
            return sources;
        });
    });

    beforeEach(function () {
        getSourceSpy.reset();
    });

    after(function () {
        getSourceSpy.restore();
    });

    describe("Tests the \"getAndSaveSouces\" method", function () {
        it("Tests the getAndSaveSources function with full sources.", function () {
            return IndexUtils.getAndSaveSources(sources).then(function (returnedSources: Source[]) {
                expect(returnedSources).to.have.members(sources);
            });
        });

        it("Tests the getAndSaveSouces returns from from the database if sources is empty.", function () {
            return IndexUtils.getAndSaveSources([]).then(function (returnedSources: Source[]) {
                expect(returnedSources).to.have.members(sources);
                expect(getSourceSpy).to.be.calledOnce;
            });
        });

        it("Tests the getAndSaveSources returns from the database if sources is undefined.", function () {
            return IndexUtils.getAndSaveSources(undefined).then(function (returnedSources: Source[]) {
                expect(returnedSources).to.have.members(sources);
                expect(getSourceSpy).to.be.calledOnce;
            });
        });

        it("Tests the getAndSaveSources returns from the database if sources is null.", function () {
            // tslint:disable:no-null-keyword
            return IndexUtils.getAndSaveSources(null).then(function (returnedSources: Source[]) {
                expect(returnedSources).to.have.members(sources);
                expect(getSourceSpy).to.be.calledOnce;
            });
            // tslint:enable:no-null-keyword
        });
    });

    describe("Tests the \"findSource\" methods.", function() {
        it ("Tests the correct source is returned from the array.", function() {
            return IndexUtils.findSource(sources, sources[3].id).then(function(returnedSource: Source) {
                expect(returnedSource).to.equal(sources[3]);
            });
        });

        it ("Tests the correct source is returned from the database with empty array.", function() {
            return IndexUtils.findSource([], sources[3].id).then(function(returnedSource: Source) {
                expect(returnedSource).to.equal(sources[3]);
                expect(getSourceSpy).to.be.calledOnce;
            });
        });

        it ("Tests the correct source is returned from the database with undefined array.", function() {
            return IndexUtils.findSource(undefined, sources[3].id).then(function(returnedSource: Source) {
                expect(returnedSource).to.equal(sources[3]);
                expect(getSourceSpy).to.be.calledOnce;
            });
        });

        it ("Tests the correct source is returned from the database with null array.", function() {
            // tslint:disable:no-null-keyword
            return IndexUtils.findSource(null, sources[3].id).then(function(returnedSource: Source) {
                expect(returnedSource).to.equal(sources[3]);
                expect(getSourceSpy).to.be.calledOnce;
            });
            // tslint:enable:no-null-keyword
        });

        it ("Tests an error is thrown if there is no source found with the given id.", function() {
            return IndexUtils.findSource(sources, "Not really an ID that is in the array, but if it is then that's really weird.").then(function(returnedSource: Source) {
                expect(true).to.be.false("A Source was returned when it should not have existed.");
            }).catch(function(a: Error) {
                expect(a).to.not.be.undefined;
            });
        });
    });

    describe("Tests \"dispatchSelectedSourceSource\" method.", function() {

        let store: any;

        beforeEach(function() {
            store = mockStore({});
        });

        it("Tests that the found Source was properly dispatched.", function() {
            return IndexUtils.dispatchSelectedSourceSource(store.dispatch, sources[3].id, sources)
                    .then(function(returnedSource: Source) {
                        expect(returnedSource).to.equal(sources[3]);

                        let actions = store.getActions();
                        expect(actions[0].type).to.equal(FETCH_LOGS_REQUEST);
                        expect(actions[1].type).to.equal(SET_CURRENT_SOURCE);
                        expect(actions[1].source).to.equal(sources[3]);
                    });
        });

        it("Tests that the found Source was properly dispatched with empty sources.", function() {
            return IndexUtils.dispatchSelectedSourceSource(store.dispatch, sources[3].id, [])
                    .then(function(returnedSource: Source) {
                        expect(returnedSource).to.equal(sources[3]);
                        expect(getSourceSpy).to.be.calledOnce;

                        let actions = store.getActions();
                        expect(actions[0].type).to.equal(FETCH_LOGS_REQUEST);
                        expect(actions[1].type).to.equal(SET_CURRENT_SOURCE);
                        expect(actions[1].source).to.equal(sources[3]);
                    });
        });

        it("Tests that the found Source was properly dispatched with undefined sources.", function() {
            return IndexUtils.dispatchSelectedSourceSource(store.dispatch, sources[3].id, undefined)
                    .then(function(returnedSource: Source) {
                        expect(returnedSource).to.equal(sources[3]);
                        expect(getSourceSpy).to.be.calledOnce;

                        let actions = store.getActions();
                        expect(actions[0].type).to.equal(FETCH_LOGS_REQUEST);
                        expect(actions[1].type).to.equal(SET_CURRENT_SOURCE);
                        expect(actions[1].source).to.equal(sources[3]);
                    });
        });

        it("Tests that the found Source was properly dispatched with null sources.", function() {
            // tslint:disable:no-null-keyword
            return IndexUtils.dispatchSelectedSourceSource(store.dispatch, sources[3].id, null)
                    .then(function(returnedSource: Source) {
                        expect(returnedSource).to.equal(sources[3]);
                        expect(getSourceSpy).to.be.calledOnce;

                        let actions = store.getActions();
                        expect(actions[0].type).to.equal(FETCH_LOGS_REQUEST);
                        expect(actions[1].type).to.equal(SET_CURRENT_SOURCE);
                        expect(actions[1].source).to.equal(sources[3]);
                    });
            // tslint:enable:no-null-keyword
        });

        it("Tests that an error is thrown if no source is found.", function() {
            return IndexUtils.dispatchSelectedSourceSource(store.dispatch, "Really fake ID that doesn't exist in the sources.", sources)
                    .then(function(returnedSource: Source) {
                        expect(true).to.be.false("A Source was returned when it should not have existed.");
                    }).catch(function(a: Error) {
                        expect(a).to.not.be.undefined;
                    });
        });
    });

    describe("Tests the \"RemoveSelectedSource\" method", function() {
        let store: any;

        beforeEach(function() {
            store = mockStore({});
        });

        it("Checks that a dispatched action for removing the selected source was thrown.", function() {
            IndexUtils.removeSelectedSource(store.dispatch);

            let actions = store.getActions();
            expect(actions[0].type).to.equal(SET_CURRENT_SOURCE);
            expect(actions[0].source).to.equal(undefined);
        });
    });
});