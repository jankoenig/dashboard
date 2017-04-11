import * as chai from "chai";
import { shallow } from "enzyme";
import * as React from "react";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

import Source from "../models/source";
import * as SourceForm from "./SourceForm";

// Setup chai with sinon-chai
chai.should();
chai.use(sinonChai);
let expect = chai.expect;

interface TestNameRule extends SourceForm.NameRule {
    readonly errorMessage: Sinon.SinonSpy;
}

describe("SourceForm", function () {
    it("Renders properly", function () {
        let createSource = function (source: Source) {
            console.info("Creating source.");
        };
        let validator: SourceForm.NameRule = {
            regex: /\w/,
            errorMessage: (input: string): string => {
                console.info("Validator " + name);
                return undefined;
            }
        };

        let wrapper = shallow((
            <SourceForm.SourceForm createSource={createSource}
                nameRule={validator} />
        ));

        expect(wrapper.find("FormInput").length).to.equal(1);
    });

    it("Tests the onChange system.", function () {
        const createSource = sinon.stub();
        const onChange = sinon.stub();
        let wrapper = shallow((
            <SourceForm.SourceForm createSource={createSource}
                onChange={onChange}
                nameRule={undefined} />
        ));

        let formInputs = wrapper.find("FormInput");
        let nameForm = formInputs.at(0);

        nameForm.simulate("change", { target: { value: "ABCD" } });

        expect(onChange).to.have.been.calledOnce;
        expect(onChange).to.have.been.calledWith("ABCD");
    });

    describe("Validator", function () {
        let positiveValidator: TestNameRule;
        let threeLengthValidator: TestNameRule;
        let noNumberValidator: TestNameRule;
        let createSource: Sinon.SinonSpy;

        beforeEach(function () {
            positiveValidator = {
                regex: undefined,
                errorMessage: sinon.spy(function (name: string): string {
                    return "Hopefully you'll never see this since it'll always be positive.";
                })
            };

            threeLengthValidator = {
                regex: /^\w{3}$/,
                errorMessage: sinon.spy(function (name: string): string {
                    return "The value " + name + " is less than three characters.";
                })
            };

            noNumberValidator = {
                regex: /^[a-zA-Z]+$/,
                errorMessage: sinon.spy(function (name: string): string {
                    return "The value " + name + " contains a number.";
                })
            };

            createSource = sinon.spy(function (source: Source) {
                console.info("Creating source");
            });
        });

        afterEach(function () {
            positiveValidator.errorMessage.reset();
            threeLengthValidator.errorMessage.reset();
            noNumberValidator.errorMessage.reset();
            createSource.reset();
        });

        it("Checks that forms are empty at start.", function () {
            let wrapper = shallow((
                <SourceForm.SourceForm createSource={createSource}
                    nameRule={positiveValidator} />
            ));

            let formInputs = wrapper.find("FormInput");

            let nameForm = formInputs.at(0);
            expect(nameForm.props().value).to.equal("");
        });

        it("Checks that the source is nulled when validator goes from true to false.", function () {
            let wrapper = shallow((
                <SourceForm.SourceForm createSource={createSource}
                    nameRule={noNumberValidator} />
            ));

            let formInputs = wrapper.find("FormInput");
            let nameForm = formInputs.at(0);

            nameForm.simulate("change", { target: { value: "ABCD" } });

            expect(wrapper.state().source).to.not.be.undefined;

            nameForm.simulate("change", { target: { value: "ABCD1" } });

            expect(wrapper.state().source).to.be.undefined;

            nameForm.simulate("change", { target: { value: "ABCDE" } });

            expect(wrapper.state().source).to.not.be.undefined;
        });
    });
});