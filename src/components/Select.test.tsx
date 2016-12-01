import * as chai from "chai";
import { mount, shallow } from "enzyme";
// tslint:disable:no-unused-variable
import * as React from "react"; // Needed for enzyme, unused for some reason.
// tslint:enable:no-unused-variable
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

import { Select, SelectAdapter, SelectListener } from "./Select";

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

class Listener implements SelectListener<any> {
    onSelected(item: any, index: number) { }
}

describe("Select", function () {

    jsdom();

    describe("with text", function () {

        let changeListeningStub: SelectListener<any>;

        before(function() {
            changeListeningStub = new Listener();
            changeListeningStub.onSelected = sinon.stub();
        });

        it("base correctly", function () {
            const wrapper = mount(<Select hint={testHint} adapter={adapter} selectListener={changeListeningStub}/>);

            const div = wrapper.find("div").first();
            const select = wrapper.find("ul").first();

            expect(div).to.not.be.undefined;
            expect(select).to.not.be.undefined;

            const options = select.find("li");

            expect(options.length).to.equal(adapter.getCount());
        });
    });
});