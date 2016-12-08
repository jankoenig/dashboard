import * as chai from "chai";
import { mount } from "enzyme";
// tslint:disable:no-unused-variable
import * as React from "react"; // Needed for enzyme, unused for some reason.
// tslint:enable:no-unused-variable
import * as sinon from "sinon";

import { Select, SelectAdapter } from "./Select";

let jsdom = require("mocha-jsdom");

let expect = chai.expect;

let testSelections = [
    "Selection 1",
    "Selection 2",
    "Selection 3"
];

let testHint = "TestHint";

let adapter: SelectAdapter<string> = {
    getCount(): number {
        return testSelections.length;
    },

    getItem(index: number): string {
        return testSelections[index];
    },

    getTitle(index: number): string {
        return testSelections[index];
    }
};

describe("Select", function () {

    jsdom();

    describe("with text", function () {

        let onSelected: Sinon.SinonStub;
        let onUnselected: Sinon.SinonStub;

        before(function () {
            onSelected = sinon.stub();
            onUnselected = sinon.stub();
        });

        beforeEach(function () {
            onSelected.reset();
            onUnselected.reset();
        });

        it("base correctly", function () {
            const wrapper = mount(<Select hint={testHint} adapter={adapter} onSelected={onSelected} onUnselected={onUnselected} />);

            const div = wrapper.find("div").first();
            const select = wrapper.find("ul").first();

            expect(div).to.not.be.undefined;
            expect(select).to.not.be.undefined;

            const options = select.find("li");

            // There is the "none selected" item that increases it by 1.
            expect(options.length).to.equal(adapter.getCount() + 1);
        });
    });
});