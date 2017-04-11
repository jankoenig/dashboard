import * as chai from "chai";
import { shallow, ShallowWrapper } from "enzyme";
import * as React from "react";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

import Input from "react-toolbox/lib/input";

import IntegrationLambda from "./IntegrationLambda";

chai.use(sinonChai);
const expect = chai.expect;

describe("IntegrationLambda", function() {
    describe("Renders", function() {
        let wrapper: ShallowWrapper<any, any>;
        let onChange: sinon.SinonStub;

        before(function() {
            onChange = sinon.stub();
            wrapper = shallow(<IntegrationLambda
                theme={"TestTheme"}
                lambdaARN={"TestArn"}
                awsAccessKey={"TestAccessKey"}
                awsSecretKey={"TestSecretKey"}
                onChange={onChange} />);
        });

        afterEach(function() {
            onChange.reset();
        });

        it("Tests the ARN and KEY inputs exist..", function() {
            const inputs = wrapper.find(Input);
            expect(inputs).to.have.length(3);
            expect(inputs.at(0)).to.have.prop("label", "Lambda ARN");
            expect(inputs.at(0)).to.have.prop("theme", "TestTheme");
            expect(inputs.at(1)).to.have.prop("label", "IAM Access Key");
            expect(inputs.at(1)).to.have.prop("theme", "TestTheme");
            expect(inputs.at(2)).to.have.prop("label", "IAM Secret Key");
            expect(inputs.at(2)).to.have.prop("theme", "TestTheme");
        });

        it("Tests the value of the ARN is passed to the ARN input.", function() {
            testInputValue(0, "TestArn");
        });

        it("Tests the onUrlChange method is called with the new value.", function() {
            testInputChange(0, "Value", "lambdaARN", "Value");
        });

        it("Tests the value of the Access key is passed to the Access Key input.", function() {
            testInputValue(1, "TestAccessKey");
        });

        it("Tests the onUrlChange method is called with the new value.", function() {
            testInputChange(1, "New Value", "awsAccessKey", "New Value");
        });

        it("Tests the value of the Secret Key is passed to the Access Key input.", function() {
            testInputValue(2, "TestSecretKey");
        });

        it("Tests the onUrlChange method is called with the new value.", function() {
            testInputChange(2, "New Value", "awsSecretKey", "New Value");
        });

        function testInputValue(index: number, expectedValue: string) {
            const inputWrapper = wrapper.find(Input).at(index);
            expect(inputWrapper).to.have.prop("value", expectedValue);
        }

        function testInputChange(index: number, changeTo: string, firstArg: string, secondArg: string) {
            const inputWrapper = wrapper.find(Input).at(index);
            inputWrapper.simulate("change", changeTo);
            expect(onChange).to.have.been.calledOnce;
            expect(onChange).to.have.been.calledWith(firstArg, secondArg);
        }
    });
});