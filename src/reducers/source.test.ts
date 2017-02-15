import { expect } from "chai";

import * as actions from "../actions/source";
import Source from "../models/source";
import { dummySources } from "../utils/test";
import { source, SourceState } from "./source";

describe("Source Reducer", function () {
    it("returns the initial state", function () {
        let newState = source(undefined, { type: "" });
        expect(newState.sources).to.have.length(0);
        expect(newState.error).to.be.undefined;
    });

    describe("SetCurrentSource", function () {
        it("sets the current source", function () {
            let newSource = new Source({ name: "name" });
            let setCurrentSourceAction = actions.setCurrentSource(newSource);
            let newState = source(undefined, setCurrentSourceAction);
            expect(newState.currentSource).to.equal(newSource);
        });
    });

    describe("SetSources", function () {
        it("sets the sources", function () {
            let newSource = new Source({ name: "name" });
            let setSourcesAction = actions.setSources([newSource]);
            let newState = source(undefined, setSourcesAction);
            expect(newState.sources).to.have.length(1);
            expect(newState.sources[0]).to.equal(newSource);
        });
    });

    describe("CreateSourceSuccess", function () {
        it("sets the new source and sourceRequest to false", function () {
            let newSource = new Source({ name: "name" });
            let createSourceSuccess = actions.createSourceSuccess(newSource);
            let newState = source(undefined, createSourceSuccess);
            expect(newState.sources).to.have.length(1);
            expect(newState.sources[0]).to.equal(newSource);
        });

        it("appends the new source to the existing", function () {
            let newSource = new Source({ name: "name" });
            let existingSource = new Source({ name: "existing" });
            let createSourceSuccess = actions.createSourceSuccess(newSource);
            let oldState = {
                sources: [existingSource],
                sourceRequest: true
            };
            let newState = source(oldState, createSourceSuccess);
            expect(newState.sources).to.have.length(2);
            expect(newState.sources).to.contain(newSource);
            expect(newState.sources).to.contain(existingSource);
        });
    });

    describe("RemoveSource", function () {

        let sources: Source[];
        let oldState: SourceState;

        before(function () {
            sources = dummySources(10);
        });

        describe("Tests updating the sources array.", function () {
            before(function () {
                oldState = {
                    sources: sources,
                    currentSource: undefined
                };
            });

            it("Removes the source from the beginning of the list.", function () {
                const sourceToRemove = sources[0];
                const removeAction = actions.removeSource(sourceToRemove);
                const newState = source(oldState, removeAction);

                expect(newState.currentSource).to.be.undefined;
                expect(newState.error).to.be.undefined;

                const expectedArray = sources.slice();
                expectedArray.shift();

                expect(newState.sources).to.deep.equal(expectedArray);
            });

            it("Removes the source from the middle of the list.", function () {
                const sourceToRemove = sources[5];
                const removeAction = actions.removeSource(sourceToRemove);
                const newState = source(oldState, removeAction);

                expect(newState.currentSource).to.be.undefined;
                expect(newState.error).to.be.undefined;

                const expectedArray = sources.slice();
                expectedArray.splice(5, 1);

                expect(newState.sources).to.deep.equal(expectedArray);
            });

            it("Removes the source from the end of the list.", function () {
                const sourceToRemove = sources[9];
                const removeAction = actions.removeSource(sourceToRemove);
                const newState = source(oldState, removeAction);

                expect(newState.currentSource).to.be.undefined;
                expect(newState.error).to.be.undefined;

                const expectedArray = sources.slice();
                expectedArray.pop();

                expect(newState.sources).to.deep.equal(expectedArray);
            });
        });

        describe("Tests removing the current source.", function () {
            before(function () {
                oldState = {
                    sources: sources,
                    currentSource: sources[5]
                };
            });

            it("Sets the current source to undefined when removed.", function () {
                const sourceToRemove = sources[5];
                const removeAction = actions.removeSource(sourceToRemove);
                const newState = source(oldState, removeAction);

                expect(newState.currentSource).to.be.undefined;
                expect(newState.error).to.be.undefined;
            });

            it("Leaves the current source alone when it's not the one being removed.", function () {
                const sourceToRemove = sources[3];
                const removeAction = actions.removeSource(sourceToRemove);
                const newState = source(oldState, removeAction);

                expect(newState.currentSource).to.deep.equal(sources[5]);
                expect(newState.error).to.be.undefined;
            });
        });
    });
});