import * as chai from "chai";
import { shallow } from "enzyme";
// tslint:disable:no-unused-variable
import * as React from "react"; // Needed for enzyme, unused for some reason.
// tslint:enable:no-unused-variable

import Output from "../../models/output";
import OutputList from "./OutputList";

let expect = chai.expect;

describe("OutputList", function() {
    it("renders correctly", function() {

       let output = new Output({
            message: "message",
            level: "DEBUG",
            timestamp: new Date(),
            transaction_id: "transaction_id",
            id: "id"
        });
        let outputs = [output];

        const wrapper = shallow(<OutputList outputs={outputs} />);

        expect(wrapper.find("ul")).to.have.length(1);
        expect(wrapper.find("OutputListItem")).to.have.length(1);
    });
});