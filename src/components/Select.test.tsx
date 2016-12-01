import * as chai from "chai";
import { shallow } from "enzyme";
// tslint:disable:no-unused-variable
import * as React from "react"; // Needed for enzyme, unused for some reason.
// tslint:enable:no-unused-variable

import { Select, SelectAdapter } from "./Select";

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

    getTitle(item: string, index: number): string {
        return testSelections[index];
    }
}

describe("Select", function () {
    describe("with text", function () {
        it("base correctly", function () {
            const wrapper = shallow(<Select hint={testHint} adapter={adapter} />);

            const div = wrapper.find("div").first();
            const select = wrapper.find("ul").first();

            expect(div).to.not.be.undefined;
            expect(select).to.not.be.undefined;

            console.info("CHILDREN = " + select.children().length);

            const options = wrapper.find("li");

            expect(options.length).to.equal(adapter.getCount());

            // expect(options.at(0).childAt(0)).to.equal(adapter.getTitle(0));
            // expect(options.at(1).props().value).to.equal(adapter.getItem(1));
            // expect(options.at(2).props().value).to.equal(adapter.getItem(2));
        });
    });
});