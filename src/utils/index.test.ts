import * as chai from "chai";

import utils from "./index";

let expect = chai.expect;

describe("Utils", function () {
    it("throws an error on node.js", function() {
        // navigator is not defined on node.js
        expect(utils.isMobileOrTablet).to.throw(ReferenceError);
    });

    it("checks mobile platform correctly", function() {
        expect(utils.isMobileOrTabletImpl("iphone", "")).to.be.true;
        expect(utils.isMobileOrTabletImpl("android", "")).to.be.true;
        expect(utils.isMobileOrTabletImpl("", "android")).to.be.true;
        expect(utils.isMobileOrTabletImpl("blackberry", "")).to.be.true;
    });

    it("checks desktop platform correctly", function() {
        expect(utils.isMobileOrTabletImpl("chrome", "")).to.be.false;
        expect(utils.isMobileOrTabletImpl("firefox", "")).to.be.false;
        expect(utils.isMobileOrTabletImpl("", "safari")).to.be.false;
        expect(utils.isMobileOrTabletImpl("", "")).to.be.false;
    });

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
});