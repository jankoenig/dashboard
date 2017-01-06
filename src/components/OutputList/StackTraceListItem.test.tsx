import * as chai from "chai";
import { shallow } from "enzyme";
import * as React from "react";
import FontIcon from "react-toolbox/lib/font_icon";
import * as sinonChai from "sinon-chai";

import StackTrace from "../../models/stack-trace";
import StackTraceElement from "../../models/stack-trace-element";
import ListItemMessage from "./ListItemMessage";
import StackTraceListItem from "./StackTraceListItem";

// Setup chai with sinon-chai
chai.should();
chai.use(sinonChai);
let expect = chai.expect;

describe("StackTraceListItem", function () {
    let stackTraceElement = new StackTraceElement({
        raw: "raw",
        line: 34,
        file: "file.java",
        class: "class",
        method: "someMethod"
    });
    let stackTrace = new StackTrace({
        id: "id",
        timestamp: new Date(),
        raw: "raw",
        message: "message",
        elements: [stackTraceElement]
    });
    let wrapper = shallow((
        <StackTraceListItem stackTrace={stackTrace} />
    ));
    let message = wrapper.find(ListItemMessage);
    let fontIcon = message.find(FontIcon);
    let ul = wrapper.find("ul");

    describe("when rendered", function () {
        it("renders the main list item", function() {
            expect(wrapper.first().type()).to.equal("li");
        });
        it("renders a ListItemMessage", function() {
            expect(message).to.have.length(1);
        });
        it("sets the timestamp on the message", function () {
            expect(message.prop("timestamp")).to.equal(stackTrace.timestamp);
        });
        it("sets the message on the message", function() {
            expect(message.prop("message")).to.equal(stackTrace.message);
        });
        it("sets the color on the messsage", function() {
            expect(message.prop("levelColor")).to.equal("red");
        });
        it("renders a FontIcon", function() {
            expect(fontIcon).to.have.length(1);
            expect(fontIcon.prop("value")).to.equal("expand_more");
        });
        it("renders a unordered list", function() {
            expect(ul).to.have.length(1);
        });
        it("renders a list item in the unordered list", function() {
            expect(ul.find("li")).to.have.length(1);
        });
    });
    describe("onClick", function () {
        message.simulate("click");
        wrapper.update();

        it("updates the state", function() {
            expect(wrapper.state("displayElements")).to.be.true;
        });
        it("updates the FontIcon", function() {
            expect(wrapper.find(FontIcon).prop("value")).to.equal("expand_less");
        });
    });
});