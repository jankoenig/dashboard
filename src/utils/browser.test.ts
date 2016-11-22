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
            let dummyWindow = {innerWidth: (browser.mobileWidthThreshold - 1)};
            expect(browser.isMobileWidth(<Window>dummyWindow)).to.equal(true);
        });
        it("returns false on large windows", function() {
            let dummyWindow = {innerWidth: browser.mobileWidthThreshold};
            expect(browser.isMobileWidth(<Window>dummyWindow)).to.equal(false);
        });
    });
    describe("onResize", function() {
        it("thows an error on node.js if you don't pass in a window", function() {
            expect(browser.onResize).to.throw(ReferenceError);
        });
        it("sets up an event listener for the 'resize` event", function() {
            let registeredEvent: string;
            let registeredCallback: (event: UIEvent) => void;
            let dummyWindow = { addEventListener: function(event: string, callback: (event: UIEvent) => void) {
                registeredEvent = event;
                registeredCallback = callback;
            }};
            let callback = function(event: UIEvent) { };

            browser.onResize(callback, <Window>dummyWindow);

            expect(registeredEvent).to.equal("resize");
            expect(registeredCallback).to.equal(callback);
        });
    });
    describe("size", function() {
        it("thows an error on node.js if you don't pass in a window", function() {
            expect(browser.size).to.throw(ReferenceError);
        });
        it("returns the correct size", function() {
            let dummyWindow = {innerWidth: 480, innerHeight: 1020};
            expect(browser.size(<Window>dummyWindow)).to.deep.equal({width: 480, height: 1020});
        });
    });
});