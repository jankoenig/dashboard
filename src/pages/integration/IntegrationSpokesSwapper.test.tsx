import * as chai from "chai";
import { shallow, ShallowWrapper } from "enzyme";
import * as React from "react";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

import IntegrationHttp from "./IntegrationHttp";
import IntegrationLambda from "./IntegrationLambda";
import IntegrationSpokesSwapper from "./IntegrationSpokesSwapper";

chai.use(sinonChai);
const expect = chai.expect;

describe("IntegrationPage", function () {
    describe("Renders", function () {
        let wrapper: ShallowWrapper<any, any>;
        let onChange: Sinon.SinonStub;

        before(function() {
            onChange = sinon.stub();
        });

        afterEach(function() {
            onChange.reset();
        });

        describe("Http page", function () {

            before(function() {
                wrapper = shallow(<IntegrationSpokesSwapper
                    showPage="http"
                    arn="TestArn"
                    iamAccessKey="TestAccessKey"
                    iamSecretKey="TestSecretKey"
                    url="TestUrl"
                    onChange={onChange}
                />);
            });

            it("Tests the http page exists.", function () {
                expect(wrapper.find(IntegrationHttp)).to.have.length(1);
            });

            it("Tests that the lambda page does not exist.", function() {
                expect(wrapper.find(IntegrationLambda)).to.have.length(0);
            });

            it("Tests the http page gets the appropriate props.", function() {
                const httpWrapper = wrapper.find(IntegrationHttp).at(0);
                expect(httpWrapper).to.have.prop("url", "TestUrl");
            });

            it("Tests the http page will pass up the url change..", function() {
                const httpWrapper = wrapper.find(IntegrationHttp).at(0);
                httpWrapper.simulate("urlChange", "New Url");
                expect(onChange).to.have.been.calledOnce;
                expect(onChange).to.have.been.calledWith("url", "New Url");
            });
        });

        describe("Lambda page", function () {

            before(function() {
                wrapper = shallow(<IntegrationSpokesSwapper
                    showPage="lambda"
                    arn="TestArn"
                    iamAccessKey="TestAccessKey"
                    iamSecretKey="TestSecretKey"
                    url="TestUrl"
                    onChange={onChange}
                />);
            });

            it("Tests the http page does not exist.", function () {
                expect(wrapper.find(IntegrationHttp)).to.have.length(0);
            });

            it("Tests that the lambda page exists.", function() {
                expect(wrapper.find(IntegrationLambda)).to.have.length(1);
            });

            it("Tests the http page gets the appropriate props.", function() {
                const lambdaWrapper = wrapper.find(IntegrationLambda).at(0);
                expect(lambdaWrapper).to.have.prop("arn", "TestArn");
                expect(lambdaWrapper).to.have.prop("iamAccessKey", "TestAccessKey");
                expect(lambdaWrapper).to.have.prop("iamSecretKey", "TestSecretKey");
            });

            it("Tests the http page will pass up the arn change.", function() {
                const lambdaWrapper = wrapper.find(IntegrationLambda).at(0);
                lambdaWrapper.simulate("change", "arn", "New Arn");
                expect(onChange).to.have.been.calledOnce;
                expect(onChange).to.have.been.calledWith("arn", "New Arn");
            });
        });
    });
});