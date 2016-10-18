import Utils from "./Utils";
import * as chai from "chai";

let expect = chai.expect;

describe("Utils", function () {
    it("checks mobile correctly", function() {
        expect(Utils.isMobileOrTablet()).to.be.false;
    });
});