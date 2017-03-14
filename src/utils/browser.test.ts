import * as chai from "chai";

import browser from "./browser";

let expect = chai.expect;

describe("Browser Util", function () {
    describe("isMobileOrTablet", function () {
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
    describe("isMobileWidth", function () {
        it("returns true on small windows", function () {
            let dummyWindow = { innerWidth: (browser.mobileWidthThreshold - 1) };
            expect(browser.isMobileWidth(<Window>dummyWindow)).to.equal(true);
        });
        it("returns false on large windows", function () {
            let dummyWindow = { innerWidth: browser.mobileWidthThreshold };
            expect(browser.isMobileWidth(<Window>dummyWindow)).to.equal(false);
        });
    });
    describe("onResize", function () {
        it("sets up an event listener for the 'resize` event", function () {
            let registeredEvent: string;
            let registeredCallback: (event: UIEvent) => void;
            let dummyWindow = {
                addEventListener: function (event: string, callback: (event: UIEvent) => void) {
                    registeredEvent = event;
                    registeredCallback = callback;
                }
            };
            let callback = function (event: UIEvent) { };

            browser.onResize(callback, <Window>dummyWindow).register();

            expect(registeredEvent).to.equal("resize");
            expect(registeredCallback).to.equal(callback);
        });

        it("sets up an event listener for the `resize` event then tests the unregister method", function () {
            let registeredEvent: string;
            let registeredCallback: (event: UIEvent) => void;
            let unregisteredEvent: string;
            let unregisteredCallback: (event: UIEvent) => void;
            let dummyWindow = {
                addEventListener: function (event: string, callback: (event: UIEvent) => void) {
                    registeredEvent = event;
                    registeredCallback = callback;
                },

                removeEventListener: function (event: string, callback: (event: UIEvent) => void) {
                    unregisteredEvent = event;
                    unregisteredCallback = callback;
                }
            };
            let callback = function (event: UIEvent) { };

            browser.onResize(callback, <Window>dummyWindow).register();
            browser.onResize(callback, <Window>dummyWindow).unregister();

            expect(registeredEvent).to.equal("resize");
            expect(unregisteredCallback).to.equal(callback);
        });
    });

    describe("onMutation", function () {
        it("returns a a dummy instance on Node.js", function () {
            let observer = browser.onMutation(undefined, undefined);
            expect(observer).to.exist;
        });
    });

    describe("size", function () {
        it("returns the correct size", function () {
            let dummyWindow = { innerWidth: 480, innerHeight: 1020 };
            expect(browser.size(<Window>dummyWindow)).to.deep.equal({ width: 480, height: 1020 });
        });
    });
});