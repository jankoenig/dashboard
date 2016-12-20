import * as chai from "chai";
import { shallow } from "enzyme";
// tslint:disable:no-unused-variable
import * as React from "react"; // Needed for enzyme, unused for some reason.
// tslint:enable:no-unused-variable
import * as sinonChai from "sinon-chai";

import { dummyLogs, dummyOutputs } from "../utils/test";
import Interaction from "./Interaction";

// Setup chai with sinon-chai
chai.use(sinonChai);
let expect = chai.expect;

describe("Logs Page", function () {
    it("should render correctly", function () {
        const logs = dummyLogs(2);
        const outputs = dummyOutputs(2);

        const wrapper = shallow((
            <Interaction
            request={logs[0]}
            response={logs[1]}
            outputs={outputs}/>
        ));

        expect(wrapper.find("JSONTree")).to.have.length(2);
    });
});