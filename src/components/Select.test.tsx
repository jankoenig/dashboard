import * as chai from "chai";
import { shallow } from "enzyme";
// tslint:disable:no-unused-variable
import * as React from "react"; // Needed for enzyme, unused for some reason.
// tslint:enable:no-unused-variable

import Select from "./Select";

let expect = chai.expect;

let testSelections = [
    "Selection 1",
    "Selection 2",
    "Selection 3"
];

let testHint = "TestHint";

describe("Select", function () {
    describe("with text", function () {
        it("renders correctly", function () {
            const wrapper = shallow(<Select hint={testHint} selections={testSelections} />);

            const div = wrapper.find("div").first();
            const select = wrapper.find("select").first();

            expect(div.props().className).to.equal("mdl-select mdl-js-select mdl-select--floating-label");

            expect(select.props().className).to.equal("mdl-select__input");

            const options = select.find("option");

            expect(options.length).to.equal(3);

            expect(options.at(0).props().value).to.equal("Selection1");
            expect(options.at(1).props().value).to.equal("Selection2");
            expect(options.at(2).props().value).to.equal("Selection3");
        });
    });
});