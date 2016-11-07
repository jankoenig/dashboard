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
        let positiveValidator = function(name: string): boolean {
            return true;
        };
        let threeLengthValidator = function(name: string): boolean {
            return (name) && name.length >= 3;
        };

        it ("Checks that forms are empty at start.", function() {
            let createSource = function(source: Source) {
                console.info("Creating source.");
            };

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
            let validator = sinon.spy(threeLengthValidator);

            let createSource = function(source: Source) {
                console.info("Creating source.");
            };

            let wrapper = shallow(<SourceForm createSource={createSource}
                            disable={false}
                            nameRule={validator}/>);

            let formInputs = wrapper.find("FormInput");
            let nameForm = formInputs.at(0);
            let keyForm = formInputs.at(1);

            nameForm.simulate("change", {target: {value: "A"}});

            validator.should.have.been.calledOnce;
            validator.should.been.calledWith("A");

            expect(wrapper.state().name).to.equal("A");
            expect(wrapper.state().source).to.be.undefined;
        });

        it ("Checks that it uses the validator with  true results.", function() {
            let validator = sinon.spy(threeLengthValidator);

            let createSource = function(source: Source) {
                console.info("Creating source.");
            };

            let wrapper = shallow(<SourceForm createSource={createSource}
                            disable={false}
                            nameRule={validator}/>);

            let formInputs = wrapper.find("FormInput");
            let nameForm = formInputs.at(0);
            let keyForm = formInputs.at(1);

            nameForm.simulate("change", {target: {value: "A"}});
            nameForm.simulate("change", {target: {value: "AB"}});
            nameForm.simulate("change", {target: {value: "ABC"}});

            validator.should.have.been.calledThrice;
            validator.firstCall.should.have.been.calledWith("A");
            validator.secondCall.should.have.been.calledWith("AB");
            validator.thirdCall.should.have.been.calledWith("ABC");

            expect(wrapper.state().name).to.equal("ABC");
            expect(wrapper.state().source).to.not.be.undefined;
        });
    });
});