import { expect } from "chai";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import * as sinon from "sinon";

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
    });
});