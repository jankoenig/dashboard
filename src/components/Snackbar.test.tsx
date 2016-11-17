import * as chai from "chai";
import { shallow } from "enzyme";
// tslint:disable:no-unused-variable
import * as React from "react"; // Needed for enzyme, unused for some reason.
// tslint:enable:no-unused-variable

import Snackbar from "./Snackbar";

let expect = chai.expect;

describe("Snackbar", function () {
    describe("with text", function () {
        it("renders correctly", function () {
            const wrapper = shallow(<Snackbar text="message" />);
            const div = wrapper.find("div").first();
            expect(div.props().className).to.equal("mdl-js-snackbar mdl-snackbar mdl-snackbar--active");
        });
    });
    describe("without text", function () {
        it("renders correctly", function () {
            const wrapper = shallow(<Snackbar text={undefined} />);
            const div = wrapper.find("div").first();
            expect(div.props().className).to.equal("mdl-js-snackbar mdl-snackbar");
        });
    });
    describe("the button", function() {
        it("renders", function() {
            const wrapper = shallow(<Snackbar text={undefined} />);
            expect(wrapper.find("button")).to.have.length(1);
        });
        it("dismisses the snackbar when pressed", function() {
            const wrapper = shallow(<Snackbar text={"a message"} />);
            wrapper.find("button").simulate("click");
            const div = wrapper.find("div").first();
            expect(div.props().className).to.equal("mdl-js-snackbar mdl-snackbar");
        });
    });
});