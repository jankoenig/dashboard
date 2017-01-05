import * as chai from "chai";
import * as chaiEnzyme from "chai-enzyme";
import { shallow } from "enzyme";
import * as moment from "moment";
import * as React from "react";

import { DEFAULT_TIME_FORMAT, StackTraceTextItem } from "./StackTraceTextItem";

chai.use(chaiEnzyme());
let expect = chai.expect;

const DEFAULT_PROPS = StackTraceTextItem.defaultProps;

describe("StackTraceTextItem", function () {
    it("renders default correctly", function () {
        let date = new Date();
        let dateString = moment(date).format(DEFAULT_TIME_FORMAT);

        let wrapper = shallow((
            <StackTraceTextItem
                id="id"
                message="Hello"
                timestamp={date}
                level="DEBUG"/>
        ));

        let listItem = wrapper.find("li");
        expect(listItem).to.have.length(1);
        // expect(listItem).to.have.attr("key", "id"); // This is actually for React. It gets removed. Would like a way to test it.

        let spans = wrapper.find("span");
        expect(spans).to.have.length(3);

        let timeSpan = spans.at(0);
        expect(timeSpan.text()).to.equal(dateString);

        let levelSpan = spans.at(1);
        expect(levelSpan.text()).to.equal("DEBUG");
        expect(levelSpan).to.have.style("color", DEFAULT_PROPS.levelColor);

        let messageSpan = spans.at(2);
        expect(messageSpan.text()).to.equal("Hello");
        expect(messageSpan).to.have.style("color", DEFAULT_PROPS.messageColor);
    });

    it("renders overridden correctly", function () {
        let date = new Date();
        let dateString = moment(date).format(DEFAULT_TIME_FORMAT);

        let wrapper = shallow((
            <StackTraceTextItem
                id="id"
                message="Hello"
                timestamp={date}
                levelColor="#FF0000"
                messageColor="#FFFF00"
                level="DEBUG"/>
        ));

        let listItem = wrapper.find("li");
        expect(listItem).to.have.length(1);
        // expect(listItem).to.have.attr("key", "id"); // This is actually for React. It gets removed. Would like a way to test it.

        let spans = wrapper.find("span");
        expect(spans).to.have.length(3);

        let timeSpan = spans.at(0);
        expect(timeSpan.text()).to.equal(dateString);

        let levelSpan = spans.at(1);
        expect(levelSpan.text()).to.equal("DEBUG");
        expect(levelSpan).to.have.style("color", "#FF0000");

        let messageSpan = spans.at(2);
        expect(messageSpan.text()).to.equal("Hello");
        expect(messageSpan).to.have.style("color", "#FFFF00");
    });
});