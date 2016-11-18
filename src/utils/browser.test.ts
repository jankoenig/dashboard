import * as chai from "chai";

import browser from "./browser";

let expect = chai.expect;

describe("Utils", function () {
    describe("isMobileOrTablet", function () {
        it("throws an error on node.js", function () {
            // navigator is not defined on node.js
            expect(browser.isMobileOrTablet).to.throw(ReferenceError);
        });

        it("checks mobile platform correctly", function () {
            expect(browser.isMobileOrTabletImpl("iphone", "")).to.be.true;
            expect(browser.isMobileOrTabletImpl("android", "")).to.be.true;
            expect(browser.isMobileOrTabletImpl("", "android")).to.be.true;
            expect(browser.isMobileOrTabletImpl("blackberry", "")).to.be.true;
        });

        it("checks desktop platform correctly", function () {
            expect(browser.isMobileOrTabletImpl("chrome", "")).to.be.false;
            expect(browser.isMobileOrTabletImpl("firefox", "")).to.be.false;
            expect(browser.isMobileOrTabletImpl("", "safari")).to.be.false;
            expect(browser.isMobileOrTabletImpl("", "")).to.be.false;
        });
    });
});