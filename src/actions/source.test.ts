import * as chai from "chai";

import { CREATE_SOURCE_SUCCESS, SET_SOURCES } from "../constants";
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
    describe("createSourceSuccess", function() {
        it("returns an action with the source", function() {
            let source = new Source({name: "name"});
            let createSourceSuccess = actions.createSourceSuccess(source);
            expect(createSourceSuccess.type).to.equal(CREATE_SOURCE_SUCCESS);
            expect(createSourceSuccess.source).to.equal(source);
        });
    });
});