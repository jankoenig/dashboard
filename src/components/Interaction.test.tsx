import * as chai from "chai";
import { shallow, ShallowWrapper } from "enzyme";
import * as React from "react";
import JSONTree from "react-json-tree";
import * as sinonChai from "sinon-chai";

import Log from "../models/log";
import Output from "../models/output";
import { dummyLogs, dummyOutputs } from "../utils/test";
import Interaction from "./Interaction";

// Setup chai with sinon-chai
chai.use(sinonChai);
let expect = chai.expect;

describe("Interaction", function () {
    it("should render correctly", function () {
        let logs: Log[] = dummyLogs(2);
        let outputs: Output[] = dummyOutputs(2);

        const wrapper = shallow((
            <Interaction
                request={logs[0]}
                response={logs[1]}
                outputs={outputs}
                stackTraces={[]} />
        ));

        expect(wrapper.find(JSONTree)).to.have.length(2);
        const titlesWrapper = wrapper.find("h6");
        expect(titlesWrapper).to.have.length(3);
        expect(titlesWrapper.at(0).text()).to.equal("REQUEST");
        expect(titlesWrapper.at(1).text()).to.equal("RESPONSE");
        expect(titlesWrapper.at(2).text()).to.equal("LOGS");
    });

    describe("Keeping state.", function () {
        let logs: Log[];
        let outputs: Output[];
        let wrapper: ShallowWrapper<any, any>;
        let openBranches: any;

        before(function () {
            logs = dummyLogs(2);
            outputs = dummyOutputs(2);
        });

        beforeEach(function () {
            wrapper = shallow((
                <Interaction
                    request={logs[0]}
                    response={logs[1]}
                    outputs={outputs}
                    stackTraces={[]} />
            ));

            openBranches = wrapper.state("openBranches");
        });

        it("Tests the default state.", function () {
            expect(openBranches["request"]).to.be.true;
            expect(openBranches["response"]).to.be.true;
        });

        it("Tests that a branch is opened when clicked.", function() {
            const requestWrapper = wrapper.find(JSONTree).at(0);

            requestWrapper.simulate("toggle", true, ["context"], logs[0], 0);

            expect(openBranches["context"]).to.be.true;
        });

        it("Tests that a branch is closed when clicked.", function() {
            const requestWrapper = wrapper.find(JSONTree).at(0);

            requestWrapper.simulate("toggle", false, ["context"], logs[0], 0);

            expect(openBranches["context"]).to.be.false;
        });
    });
});