import * as chai from "chai";
import { shallow, ShallowWrapper } from "enzyme";
import * as React from "react";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

import IntegrationSpokes from "./IntegrationSpokes";
import IntegrationSpokesSwapper from "./IntegrationSpokesSwapper";

chai.use(sinonChai);
const expect = chai.expect;

describe("IntegrationSpokes", function() {
    describe("Renders", function() {
        let wrapper: ShallowWrapper<any, any>;
        let onChange: Sinon.SinonStub;

        before(function() {
            onChange = sinon.stub();
            wrapper = shallow(<IntegrationSpokes />);
        });

        afterEach(function() {
            onChange.reset();
        });

        it("Tests the swapper is there.", function() {
            expect(wrapper.find(IntegrationSpokesSwapper)).to.have.length(1);
        });
    });
});