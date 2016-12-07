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
    undefined,
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

        before(function () {
            onSelected = sinon.stub();
        });

        beforeEach(function () {
            onSelected.reset();
        });

        it("base correctly", function () {
            const wrapper = mount(<Select hint={testHint} adapter={adapter} onSelected={onSelected} />);

            const div = wrapper.find("div").first();
            const select = wrapper.find("ul").first();

            expect(div).to.not.be.undefined;
            expect(select).to.not.be.undefined;

            const options = select.find("li");

            expect(options.length).to.equal(adapter.getCount());
        });

        it("Tests the item is selected", function() {
            const wrapper = mount(<Select hint={testHint} adapter={adapter} onSelected={onSelected} />);

            const select = wrapper.find("ul").first();
            const options = select.find("li");

            options.at(1).simulate("click");

            expect(onSelected).to.be.calledOnce;
        });

        it ("Tests the input contains the value after select.", function() {
            const wrapper = mount(<Select hint={testHint} adapter={adapter} onSelected={onSelected} />);

            const input = wrapper.find("input").first();
            const select = wrapper.find("ul").first();
            const options = select.find("li");

            options.at(1).simulate("click");

            expect(input.props().value).to.equal("Selection 1");
        });

        it ("Tests the input contains a blank value when undefined object is returned.", function() {
            const wrapper = mount(<Select hint={testHint} adapter={adapter} onSelected={onSelected} />);

            const input = wrapper.find("input").first();
            const select = wrapper.find("ul").first();
            const options = select.find("li");

            options.at(0).simulate("click");

            expect(input.props().value).to.equal("");
        });

        it ("Tests the input defaults to the first item.", function() {
            testSelections.unshift("Preselection"); // Rather than have an "undefined", let's put an actual item to the start.

            const wrapper = mount(<Select hint={testHint} adapter={adapter} onSelected={onSelected} />);

            const input = wrapper.find("input").first();
            const select = wrapper.find("ul").first();
            const options = select.find("li");

            options.at(0).simulate("click");

            expect(input.props().value).to.equal("Preselection");
        });
    });
});