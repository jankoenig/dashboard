import * as chai from "chai";
import { shallow } from "enzyme";
import * as React from "react";
import * as Sinon from "sinon";

import LogsExplorer from "./LogsExplorer";
import { LogsPage } from "./LogsPage";

import { dummyLogs } from "../../utils/test";

let expect = chai.expect;

describe("LogsPage", function () {

    it("renders a LogsExplorer", function() {
        const getLogs = Sinon.stub().returns(dummyLogs(4));

        let wrapper = shallow(<LogsPage isLoading source={undefined} logMap={undefined} getLogs={getLogs} />);
        expect(wrapper.find(LogsExplorer)).to.have.length(1);
    });
});