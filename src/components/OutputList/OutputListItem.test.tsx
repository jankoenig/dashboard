import * as chai from "chai";
import { shallow } from "enzyme";
// tslint:disable:no-unused-variable
import * as React from "react"; // Needed for enzyme, unused for some reason.
// tslint:enable:no-unused-variable

import Output from "../../models/output";
import OutputListItem from "./OutputListItem";

let expect = chai.expect;

describe("OutputListItem", function () {
    it("renders correctly", function () {

        let output = new Output({
            message: "message",
            level: "DEBUG",
            timestamp: new Date(),
            transaction_id: "transaction_id",
            id: "id"
        });

        const wrapper = shallow(<OutputListItem output={output} />);

        let item = wrapper.find("StackTraceTextItem");
        expect(item).to.have.length(1);

        expect(item.prop("id")).to.equal(output.id);
        expect(item.prop("timestamp")).to.equal(output.timestamp);
        expect(item.prop("message")).to.equal(output.message); // Message is the top and raw is the bottom so it's combined.
        expect(item.prop("levelColor")).to.equal(output.levelColor);
    });
});