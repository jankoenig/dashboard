import * as chai from "chai";
import configureMockStore, { IStore } from "redux-mock-store";
import thunk from "redux-thunk";
import * as sinon from "sinon";

import { CREATE_SOURCE_SUCCESS, REMOVE_SOURCE, SET_SOURCES } from "../constants";
import Source from "../models/source";
import SourceService from "../services/source";
import { dummySources } from "../utils/test";
import * as actions from "./source";

let expect = chai.expect;

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe("Source Actions", function () {
    describe("setSources", function () {
        it("returns an action with the sources", function () {
            let source = new Source({ name: "name" });
            let setSourcesAction = actions.setSources([source]);
            expect(setSourcesAction.type).to.equal(SET_SOURCES);
            expect(setSourcesAction.sources[0]).to.equal(source);
        });
    });

    describe("createSourceSuccess", function () {
        it("returns an action with the source", function () {
            let source = new Source({ name: "name" });
            let createSourceSuccess = actions.createSourceSuccess(source);
            expect(createSourceSuccess.type).to.equal(CREATE_SOURCE_SUCCESS);
            expect(createSourceSuccess.source).to.equal(source);
        });
    });

    describe("Dispatch tests", function () {
        let initialState: any;
        let sources: Source[];
        let store: IStore<any>;

        before(function () {
            sources = dummySources(5);
            initialState = {
                sources: sources,
                currentSource: sources[0]
            };
        });

        beforeEach(function () {
            store = mockStore(initialState);
        });

        describe("deleteSource", function () {
            let deleteSource: Sinon.SinonStub;

            describe("Success", function () {
                before(function () {
                    deleteSource = sinon.stub(SourceService, "deleteSource").returns(Promise.resolve(sources[0]));
                });

                after(function() {
                    deleteSource.restore();
                });

                it("Tests the deleteSource service was called with the appropriate source.", function() {
                    return store.dispatch(actions.deleteSource(sources[0]))
                        .then(function(source: Source) {
                            expect(deleteSource).to.be.calledWith(source);
                        });
                });

                it("Tests the source that was removed is returned.", function () {
                    return store.dispatch(actions.deleteSource(sources[0]))
                        .then(function (source: Source) {
                            expect(source).to.deep.equal(sources[0]);
                        });
                });

                it("Tests the proper dispatches were sent.", function () {
                    return store.dispatch(actions.deleteSource(sources[0]))
                        .then(function (source: Source) {
                            const actions = store.getActions();
                            expect(actions).to.have.length(1);

                            const firstAction = actions[0] as any;
                            expect(firstAction.type).to.equal(REMOVE_SOURCE);
                            expect(firstAction.source).to.deep.equal(sources[0]);
                        });
                });
            });
        });
    });
});