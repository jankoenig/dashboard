import * as chai from "chai";
import { shallow } from "enzyme";
import * as React from "react";

let expect = chai.expect;

import DataTile from "./DataTile";

describe("DataTile", function() {
    const wrapper = shallow((
        <DataTile value={"value"} label={"label"} />
    ));
    it("renders correctly", function() {
        expect(wrapper.find("FormInput")).to.have.length(1);
    });
});