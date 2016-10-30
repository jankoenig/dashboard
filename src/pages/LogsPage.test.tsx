import * as chai from "chai";
import { shallow } from "enzyme";
// tslint:disable:no-unused-variable
import * as React from "react"; // Needed for enzyme, unused for some reason.
// tslint:enable:no-unused-variable
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

import Log from "../models/log";
import { LogsPage } from "./LogsPage";

// Setup chai with sinon-chai
chai.use(sinonChai);
let expect = chai.expect;

describe("Logs Page", function() {
    it("should render subcomponents", function() {
        const getLogs = sinon.spy();
        let logs: Log[] = [];
        const wrapper = shallow(<LogsPage
                                logs={logs}
                                getLogs={getLogs}/>);

        expect(wrapper.find("JSONTree")).to.have.length(1);
    });
});