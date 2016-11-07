import * as chai from "chai";
import { shallow } from "enzyme";
// tslint:disable:no-unused-variable
import * as React from "react"; // Needed for enzyme, unused for some reason.
// tslint:enable:no-unused-variable
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

import Source from "../models/source";
import SourceForm from "./SourceForm";

// Setup chai with sinon-chai
chai.should();
chai.use(sinonChai);
let expect = chai.expect;

describe("SourceForm", function () {

    it("Renders properly", function() {
        let createSource = function(source: Source) {
            console.info("Creating source.");
        };
        let validator = function(name?: string): boolean {
            console.info("Validator " + name);
            return true;
        };

        let wrapper = shallow(<SourceForm createSource={createSource}
                            disable={false}
                            nameRule={validator}/>);

        expect(wrapper.find("FormInput").length).to.equal(2);
    });

    describe("Validator", function() {
        let positiveValidator: Sinon.SinonSpy;
        let threeLengthValidator: Sinon.SinonSpy;
        let noNumberValidator: Sinon.SinonSpy;
        let createSource: Sinon.SinonSpy;

        beforeEach(function() {
            positiveValidator = sinon.spy(function(name: string): boolean {
                return true;
            });

            threeLengthValidator = sinon.spy(function(name: string): boolean {
                return (name) && name.length >= 3;
            });

            noNumberValidator = sinon.spy(function(name: string): boolean {
                console.info("TESTING " + name + " " + (/^[a-zA-Z]+$/.test(name)));
                return /^[a-zA-Z]+$/.test(name);
            });

            createSource = sinon.spy(function(source: Source) {
                console.info("Creating source");
            });
        });

        afterEach(function() {
            positiveValidator.reset();
            threeLengthValidator.reset();
            noNumberValidator.reset();
            createSource.reset();
        });

        it ("Checks that forms are empty at start.", function() {
            let wrapper = shallow(<SourceForm createSource={createSource}
                            disable={false}
                            nameRule={positiveValidator}/>);

            let formInputs = wrapper.find("FormInput");

            let nameForm = formInputs.at(0);
            expect(nameForm.props().value).to.equal("");


            let keyForm = formInputs.at(1);
            expect(keyForm.props().value).to.equal("");
        });

        it ("Checks that it uses the validator with false results.", function() {
            let wrapper = shallow(<SourceForm createSource={createSource}
                            disable={false}
                            nameRule={threeLengthValidator}/>);

            let formInputs = wrapper.find("FormInput");
            let nameForm = formInputs.at(0);

            nameForm.simulate("change", {target: {value: "A"}});

            threeLengthValidator.should.have.been.calledOnce;
            threeLengthValidator.should.been.calledWith("A");

            expect(wrapper.state().name).to.equal("A");
            expect(wrapper.state().source).to.be.undefined;
        });

        it ("Checks that it uses the validator with  true results.", function() {
            let wrapper = shallow(<SourceForm createSource={createSource}
                            disable={false}
                            nameRule={threeLengthValidator}/>);

            let formInputs = wrapper.find("FormInput");
            let nameForm = formInputs.at(0);

            nameForm.simulate("change", {target: {value: "A"}});
            nameForm.simulate("change", {target: {value: "AB"}});
            nameForm.simulate("change", {target: {value: "ABC"}});

            threeLengthValidator.should.have.been.calledThrice;
            threeLengthValidator.firstCall.should.have.been.calledWith("A");
            threeLengthValidator.secondCall.should.have.been.calledWith("AB");
            threeLengthValidator.thirdCall.should.have.been.calledWith("ABC");

            expect(wrapper.state().name).to.equal("ABC");
            expect(wrapper.state().source).to.not.be.undefined;
        });

        it ("Checks that the source is nulled when validator goes from true to false.", function() {
            let wrapper = shallow(<SourceForm createSource={createSource}
                            disable={false}
                            nameRule={noNumberValidator}/>);

            let formInputs = wrapper.find("FormInput");
            let nameForm = formInputs.at(0);

            nameForm.simulate("change", {target: {value: "ABCD"}});

            expect(wrapper.state().source).to.not.be.undefined;

            nameForm.simulate("change", {target: {value: "ABCD1"}});

            expect(wrapper.state().source).to.be.undefined;

            nameForm.simulate("change", {target: {value: "ABCDE"}});

            expect(wrapper.state().source).to.not.be.undefined;
        });
    });
});