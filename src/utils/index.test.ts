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
});