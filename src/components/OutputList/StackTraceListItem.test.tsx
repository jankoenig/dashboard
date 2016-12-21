import * as chai from "chai";
import { shallow } from "enzyme";
import * as React from "react";
import * as sinonChai from "sinon-chai";

import StackTrace from "../../models/stack-trace";
import StackTraceElement from "../../models/stack-trace-element";
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

    it("renders correctly", function () {

        let wrapper = shallow((
            <StackTraceListItem stackTrace={stackTrace} />
        ));

        expect(wrapper.find("li")).to.have.length(1);
    });
});