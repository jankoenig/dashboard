import * as chai from "chai";
import { shallow } from "enzyme";
import * as React from "react";

import Output from "../../models/output";
import ListItemMessage from "./ListItemMessage";
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

        const wrapper = shallow((
            <OutputListItem output={output} />
        ));

        expect(wrapper.find("li")).to.have.length(1);

        let message = wrapper.find(ListItemMessage);
        expect(message).to.have.length(1);

        expect(message.prop("timestamp")).to.equal(output.timestamp);
        expect(message.prop("message")).to.equal(output.message); // Message is the top and raw is the bottom so it's combined.
        expect(message.prop("levelColor")).to.equal(output.levelColor);

    });
});