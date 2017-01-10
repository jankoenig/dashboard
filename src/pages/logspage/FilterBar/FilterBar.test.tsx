import * as chai from "chai";
import { shallow } from "enzyme";
import * as React from "react";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

import  Filterbar from "./FilterBar";

import Source from "../../../models/source";

import LogQuery from "../../../models/log-query";

chai.use(sinonChai);
const expect = chai.expect;

describe("Filter Bar", function() {

    it ("Renders correctly", function() {
        let source = new Source({
            name: "TestSource"
        });
        let onFilter = sinon.spy();
        let logQuery = new LogQuery({ source: source});

        let wrapper = shallow(<Filterbar onFilter={onFilter}  query={logQuery} />);

        console.log(wrapper);
        expect(wrapper.find("ThemedDropdown")).to.have.length(1); // Filter by type.
        expect(wrapper.find("ThemedDatePicker")).to.have.length(2); // filter by date range
    });
});