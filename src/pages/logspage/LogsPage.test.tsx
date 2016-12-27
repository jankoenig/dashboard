import * as chai from "chai";
import { shallow } from "enzyme";
import * as React from "react";

import { LogsPage } from "./LogsPage";

let expect = chai.expect;

describe("Logs Page", function () {
    let wrapper = shallow(<LogsPage source={undefined} logMap={undefined} />);
    it("renders a LogExplorer", function() {
        expect(wrapper.find("LogExplorer")).to.have.length(1);
    });
});