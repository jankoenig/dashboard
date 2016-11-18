import * as chai from "chai";

import utils from "./index";

let expect = chai.expect;

describe("Utils", function () {
    describe("converts to camelCase", function() {
        it("a string in camelCase", function() {
            expect(utils.stringToCamelCase("camelCase")).to.equal("camelCase");
        });
        it("a one word string", function() {
            expect(utils.stringToCamelCase("camel")).to.equal("camel");
        });
        it("a two word string", function() {
            expect(utils.stringToCamelCase("Camel case")).to.equal("camelCase");
        });
        it("a three word string", function() {
            expect(utils.stringToCamelCase("camel Case case")).to.equal("camelCaseCase");
        });
        it("returns empty string for an empty string", function() {
            expect(utils.stringToCamelCase("")).to.equal("");
        });
    });

    describe("converts to a slug", function() {
        it("a string with one word", function() {
            expect(utils.stringToSlug("String")).to.equal("string");
        });

        it("a string with two words", function() {
            expect(utils.stringToSlug("One Two")).to.equal("one-two");
        });

        it("a string with an invalid charactor", function() {
            expect(utils.stringToSlug("groß word")).to.equal("gros-word");
        });
    });

    describe("Tests the random string generator", function() {
        it ("Tries to get a random string", function() {
            expect(utils.randomString(5).length).to.equal(5);
        });

        it ("Ensures a negative number throws exception", function() {
            expect(utils.randomString.bind(utils, -5)).to.throw(Error);
        });
    });
});