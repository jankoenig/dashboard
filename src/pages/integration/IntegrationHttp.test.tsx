import * as chai from "chai";
import { shallow, ShallowWrapper } from "enzyme";
import * as React from "react";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

import Input from "react-toolbox/lib/input";

import IntegrationHttp from "./IntegrationHttp";

chai.use(sinonChai);
const expect = chai.expect;

describe("IntegrationHttp", function() {
    describe("Renders", function() {
        let wrapper: ShallowWrapper<any, any>;
        let onChange: sinon.SinonStub;

        before(function() {
            onChange = sinon.stub();
            wrapper = shallow(<IntegrationHttp
                theme={"TestTheme"}
                url={"TestUrl"}
                onUrlChange={onChange} />);
        });

        afterEach(function() {
            onChange.reset();
        });

        it("Tests the URL/ARN input exists.", function() {
            expect(wrapper.find(Input)).to.have.length(1);
        });

        it("Tests the value of the url is passed to the input.", function() {
            const inputWrapper = wrapper.find(Input).at(0);
            expect(inputWrapper).to.have.prop("value", "TestUrl");
            expect(inputWrapper).to.have.prop("theme", "TestTheme");
        });

        it("Tests the onUrlChange method is called with the new value.", function() {
            const inputWrapper = wrapper.find(Input).at(0);
            inputWrapper.simulate("change", "New URL");
            expect(onChange).to.have.been.calledOnce;
            expect(onChange).to.have.been.calledWith("New URL");
        });
    });
});