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
        expect(wrapper.find("li")).to.have.length(1);

    });
});