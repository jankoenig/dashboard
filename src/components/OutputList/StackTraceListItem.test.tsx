import * as chai from "chai";
import { shallow } from "enzyme";
import * as React from "react";
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

    it("renders correctly", function () {

        let wrapper = shallow((
            <StackTraceListItem stackTrace={stackTrace} />
        ));

        // We will have two li, one for the StackTrace and one for
        // the StackTraceElement
        expect(wrapper.find("li")).to.have.length(2);

        let message = wrapper.find(ListItemMessage);
        expect(message).to.have.length(1);

        expect(message.prop("timestamp")).to.equal(stackTrace.timestamp);
        expect(message.prop("message")).to.equal(stackTrace.message);
        expect(message.prop("levelColor")).to.equal("red");
    });
});