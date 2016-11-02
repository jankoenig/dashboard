import * as chai from "chai";

import { CREATE_SOURCE_ERROR, CREATE_SOURCE_REQUEST, CREATE_SOURCE_SUCCESS, SET_SOURCES } from "../constants";
import Source from "../models/source";
import * as actions from "./source";


let expect = chai.expect;

describe("Source Actions", function() {
    describe("setSources", function() {
        it("returns an action with the sources", function() {
            let source = new Source({name: "name"});
            let setSourcesAction = actions.setSources([source]);
            expect(setSourcesAction.type).to.equal(SET_SOURCES);
            expect(setSourcesAction.sources[0]).to.equal(source);
        });
    });
    describe("getSources", function() {

    });
    describe("createSoruceRequest", function() {
        it("creates a CreateSourceRequst", function() {
            let createSourceRequest = actions.createSourceRequest();
            expect(createSourceRequest.type).to.equal(CREATE_SOURCE_REQUEST);
        });
    });
    describe("createSourceSuccess", function() {
        it("returns an action with the source", function() {
            let source = new Source({name: "name"});
            let createSourceSuccess = actions.createSourceSuccess(source);
            expect(createSourceSuccess.type).to.equal(CREATE_SOURCE_SUCCESS);
            expect(createSourceSuccess.source).to.equal(source);
        });
    });
    describe("createSourceError", function() {
        it("returns an action with the error", function() {
            let error = new Error();
            let createSourceError = actions.createSourceError(error);
            expect(createSourceError.type).to.equal(CREATE_SOURCE_ERROR);
            expect(createSourceError.error).to.equal(error);
        });
    });
});