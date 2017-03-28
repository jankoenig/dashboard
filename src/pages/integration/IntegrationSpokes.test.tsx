import * as chai from "chai";
import { shallow, ShallowWrapper } from "enzyme";
import * as React from "react";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

import { Button } from "react-toolbox/lib/button";
import Checkbox from "react-toolbox/lib/checkbox";
import Dropdown from "react-toolbox/lib/dropdown";

import Source from "../../models/source";
import User from "../../models/user";
import SpokesService from "../../services/spokes";
import { dummySources } from "../../utils/test";
import { IntegrationSpokes } from "./IntegrationSpokes";
import IntegrationSpokesSwapper from "./IntegrationSpokesSwapper";

chai.use(sinonChai);
const expect = chai.expect;

const source: Source = dummySources(1)[0];
const user = new User({ email: "test@testMctest.com" });

describe("IntegrationSpokes", function () {
    describe("Renders", function () {
        let wrapper: ShallowWrapper<any, any>;
        // let onChange: Sinon.SinonStub;
        let onSaved: Sinon.SinonStub;

        before(function () {
            onSaved = sinon.stub();
            wrapper = shallow(<IntegrationSpokes user={user} source={source} onSpokesSaved={onSaved} />);
        });

        afterEach(function () {
            onSaved.reset();
        });

        it("Tests the swapper is there.", function () {
            expect(wrapper.find(IntegrationSpokesSwapper)).to.have.length(1);
        });

        it("Tests the enable live debugging checkbox exists.", function () {
            expect(wrapper.find(Checkbox)).to.have.length(1);
            expect(wrapper.find(Checkbox).at(0)).to.have.prop("label", "Enable Live Debugging");
            expect(wrapper.find(Checkbox).at(0)).to.have.prop("checked", false);
        });

        it("Tests the save button exists.", function () {
            expect(wrapper.find(Button)).to.have.length(1);
            expect(wrapper.find(Button).at(0)).to.have.prop("label", "Save");
        });

        it("Tests the dropdown for page selector exists.", function () {
            expect(wrapper.find(Dropdown)).to.have.length(1);
        });

        it("Tests the default page", function () {
            expect(wrapper.find(Dropdown).at(0)).to.have.prop("value", "http");
            expect(wrapper.find(IntegrationSpokesSwapper).at(0)).to.have.prop("showPage", "http");
        });

        it("Tests the enable live debugging checkbox works.", function () {
            let checkbox = wrapper.find(Checkbox).at(0);
            checkbox.simulate("change", true);

            expect(wrapper.find(Checkbox).at(0)).to.have.prop("checked", true);
        });

        describe("IntegrationSpokesSwapper State", function () {
            let swapper: ShallowWrapper<any, any>;

            beforeEach(function () {
                swapper = wrapper.find(IntegrationSpokesSwapper).at(0);
            });

            it("Tests the http change will give the value to swapper.", function () {
                swapper.simulate("change", "url", "New URL");

                expect(wrapper.find(IntegrationSpokesSwapper).at(0)).to.have.prop("url", "New URL");
            });

            it("Tests the ARN change will give the value to swapper.", function () {
                swapper.simulate("change", "arn", "New ARN");

                expect(wrapper.find(IntegrationSpokesSwapper).at(0)).to.have.prop("arn", "New ARN");
            });

            it("Tests the IAM Access key change will give the value to swapper.", function () {
                swapper.simulate("change", "iamAccessKey", "New Access Key");

                expect(wrapper.find(IntegrationSpokesSwapper).at(0)).to.have.prop("iamAccessKey", "New Access Key");
            });

            it("Tests the IAM Secret key change will give the value to swapper.", function () {
                swapper.simulate("change", "iamSecretKey", "New Secret Key");

                expect(wrapper.find(IntegrationSpokesSwapper).at(0)).to.have.prop("iamSecretKey", "New Secret Key");
            });
        });
    });

    describe("Saving Spokes", function () {
        let wrapper: ShallowWrapper<any, any>;
        let onSaved: Sinon.SinonStub;
        let saveSpoke: Sinon.SinonStub;

        before(function () {
            onSaved = sinon.stub();
        });

        beforeEach(function () {
            wrapper = shallow(<IntegrationSpokes user={user} source={source} onSpokesSaved={onSaved} />);
        });

        afterEach(function () {
            onSaved.reset();
            saveSpoke.reset();
        });

        after(function () {
            saveSpoke.restore();
        });

        describe("Successful saves", function () {
            before(function () {
                saveSpoke = sinon.stub(SpokesService, "savePipe").returns(Promise.resolve());
            });

            it("Tests the appropriate parameters are passed in on HTTP.", function () {
                wrapper.setState({ showPage: "http", enableLiveDebugging: true, url: "http://test.url.fake/", arn: "fakeARN", iamAccessKey: "ABC123", iamSecretKey: "123ABC" });

                const button = wrapper.find(Button).at(0);
                button.simulate("click");

                expect(saveSpoke).to.be.calledOnce;
                const args = saveSpoke.args[0];
                expect(args[0]).to.deep.equal(user);
                expect(args[1]).to.deep.equal(source);
                expect(args[2]).to.deep.equal({ url: "http://test.url.fake/" });
                expect(args[3]).to.deep.equal(true);
            });

            it("Tests the appropriate parameters are passed in on lambda.", function () {
                wrapper.setState({ showPage: "lambda", enableLiveDebugging: true, url: "http://test.url.fake/", arn: "fakeARN", iamAccessKey: "ABC123", iamSecretKey: "123ABC" });

                const button = wrapper.find(Button).at(0);
                button.simulate("click");

                expect(saveSpoke).to.be.calledOnce;
                const args = saveSpoke.args[0];
                expect(args[0]).to.deep.equal(user);
                expect(args[1]).to.deep.equal(source);
                expect(args[2]).to.deep.equal({ awsAccessKey: "ABC123", awsSecretKey: "123ABC", lambdaARN: "fakeARN" });
                expect(args[3]).to.deep.equal(true);
            });

            it("Tests that the callback is called.", function () {
                wrapper.setState({ showPage: "http", enableLiveDebugging: true, url: "http://test.url.fake/", arn: "fakeARN", iamAccessKey: "ABC123", iamSecretKey: "123ABC" });

                const button = wrapper.find(Button).at(0);
                button.simulate("click");

                const promise = (wrapper.instance() as IntegrationSpokes).cancelables[0] as any;
                return promise
                    .then(function () {
                        expect(onSaved).to.be.calledOnce;
                    });
            });
        });
    });
});