import * as chai from "chai";
import { shallow } from "enzyme";
import * as React from "react";

import Output from "../../models/output";
import StackTrace from "../../models/stack-trace";
import OutputList from "./OutputList";
import OutputListItem from "./OutputListItem";
import StackTraceListItem from "./StackTraceListItem";

let expect = chai.expect;

describe("OutputList", function () {

    let output = new Output({
        message: "message",
        level: "DEBUG",
        timestamp: new Date(),
        transaction_id: "transaction_id",
        id: "id"
    });

    let stackTrace = new StackTrace({
        id: "stId",
        timestamp: new Date(),
        raw: "raw message",
        message: "message",
        elements: []
    });

    const wrapper = shallow(<OutputList outputs={[output]} stackTraces={[stackTrace]} />);

    it("renders the unordered list", function () {
        expect(wrapper.find("ul")).to.have.length(1);
    });
    it("renders the OutputListItem", function () {
        expect(wrapper.find(OutputListItem)).to.have.length(1);
        expect(wrapper.find(OutputListItem).prop("output")).to.equal(output);
    });
    it("renders the StackTraceListItem", function () {
        expect(wrapper.find(StackTraceListItem)).to.have.length(1);
        expect(wrapper.find(StackTraceListItem).prop("stackTrace")).to.equal(stackTrace);
    });
});