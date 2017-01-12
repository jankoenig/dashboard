import * as chai from "chai";
import { shallow } from "enzyme";
import * as React from "react";
import * as sinonChai from "sinon-chai";

import { dummyLogs, dummyOutputs } from "../utils/test";
import Interaction from "./Interaction";

// Setup chai with sinon-chai
chai.use(sinonChai);
let expect = chai.expect;

describe("Interaction", function () {
    it("should render correctly", function () {
        const logs = dummyLogs(2);
        const outputs = dummyOutputs(2);

        const wrapper = shallow((
            <Interaction
                request={logs[0]}
                response={logs[1]}
                outputs={outputs}
                stackTraces={[]} />
        ));

        expect(wrapper.find("JSONTree")).to.have.length(2);
    });
});