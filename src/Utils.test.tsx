import utils from "./Utils";
import * as chai from "chai";
import * as mockBrowser from "mock-browser";

let expect = chai.expect;

describe("Utils", function () {
    let FakeBrowserModel = mockBrowser.mocks.MockBrowser;
    let fakeBrowserInstance = new FakeBrowserModel();

    it("checks mobile correctly", function() {
        expect(utils.isMobileOrTablet(fakeBrowserInstance.getNavigator())).to.be.false;
    });
});