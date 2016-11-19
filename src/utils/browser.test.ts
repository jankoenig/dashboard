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
    describe("isMobileWidth", function() {
        it("throws an error on node.js if you don't pass in a window", function() {
            expect(browser.isMobileWidth).to.throw(ReferenceError);
        });
        it("returns true on small windows", function() {
            let dummyWindow = {innerWidth: 479};
            expect(browser.isMobileWidth(<Window>dummyWindow)).to.equal(true);
        });
        it("returns false on large windows", function() {
            let dummyWindow = {innerWidth: 480};
            expect(browser.isMobileWidth(<Window>dummyWindow)).to.equal(false);
        });
    });
});