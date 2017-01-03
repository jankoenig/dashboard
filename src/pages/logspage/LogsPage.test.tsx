import * as chai from "chai";
import { shallow } from "enzyme";
import * as React from "react";

import LogsExplorer from "./LogsExplorer";
import { LogsPage } from "./LogsPage";

let expect = chai.expect;

describe("LogsPage", function () {
    let wrapper = shallow(<LogsPage source={undefined} logMap={undefined} />);
    it("renders a LogsExplorer", function() {
        expect(wrapper.find(LogsExplorer)).to.have.length(1);
    });
});