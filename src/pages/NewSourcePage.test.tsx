import * as chai from "chai";
import { shallow } from "enzyme";
// tslint:disable:no-unused-variable
import * as React from "react"; // Needed for enzyme, unused for some reason.
// tslint:enable:no-unused-variable
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

import { Source } from "../models/source";
import service from "../services/source";
import { NewSourcePage, SourceNameRule } from "./NewSourcePage";

// Setup chai with sinon-chai
chai.use(sinonChai);
let expect = chai.expect;

let partialSource: Source = new Source({
    name: "TestSource"
});

let completeSource: Source = new Source({
    secretKey: "ABCD1234",
    name: "TestSource",
    id: "TestSourceId",
    created: new Date()
});

describe("New Source Page", function () {

    it("should render correctly", function () {
        const newSource = sinon.spy();
        const goToLogs = sinon.spy();
        const wrapper = shallow(
            <NewSourcePage
                newSource={newSource}
                goToLogs={goToLogs}
                sources={[]} />
        );
        expect(wrapper.find("NewSkillForm")).to.have.length(1);
    });

    it("should render correctly with new state.", function () {
        const newSource = sinon.spy();
        const goToLogs = sinon.spy();
        const wrapper = shallow(
            <NewSourcePage
                newSource={newSource}
                goToLogs={goToLogs}
                sources={[]} />
        );

        wrapper.setState({
            source: completeSource
        });

        expect(wrapper.find("CodeForm")).to.have.length(1);
    });

    it("Tests the \"goBack\" feature is handled appropriately.", function() {
        const newSource = sinon.spy();
        const goToLogs = sinon.spy();
        const wrapper = shallow(
            <NewSourcePage
                newSource={newSource}
                goToLogs={goToLogs}
                sources={[]} />
        );

        wrapper.setState({
            source: completeSource
        });

        wrapper.find("CodeForm").simulate("goBack");

        wrapper.update();

        expect(wrapper.find("CodeForm")).to.have.length(0);
        expect(wrapper.find("NewSkillForm")).to.have.length(1);
    });

    describe("Successful source creation handling.", function () {

        let createSourceMock: Sinon.SinonStub;
        let completePromise: Promise<Source>;

        beforeEach(function () {
            completePromise = Promise.resolve(completeSource);
            createSourceMock = sinon.stub(service, "createSource", function () {
                return completePromise;
            });
        });

        afterEach(function () {
            createSourceMock.restore();
        });

        it("checks a new source creation throws appropriate dispatch.", function () {
            const newSource = sinon.spy();
            const goToLogs = sinon.spy();
            const wrapper = shallow(
                <NewSourcePage
                    newSource={newSource}
                    goToLogs={goToLogs}
                    sources={[]} />
            );

            wrapper.find("NewSkillForm").simulate("createSource", partialSource);

            return completePromise.then(() => {
                console.info("COMPLETE AREAS");
                wrapper.update();
                let source = wrapper.state("source");
                let error = wrapper.state("error");
                console.log(source);
                expect(wrapper.find("NewSkillForm")).to.have.length(0);
                expect(wrapper.find("CodeForm")).to.have.length(1);
                expect(source).to.deep.equal(completeSource);
                expect(error).to.be.undefined;
                expect(newSource).to.be.calledOnce;
                expect(newSource).to.be.calledWithExactly(completeSource);
            });
        });
    });

    describe("Unsuccessful create source handling.", function () {
        let createSourceMock: Sinon.SinonStub;
        let completePromise: Promise<Source>;

        beforeEach(function () {
            completePromise = Promise.reject(new Error("Rejection based on requirements of the test."));
            createSourceMock = sinon.stub(service, "createSource", function () {
                return completePromise;
            });
        });

        afterEach(function () {
            createSourceMock.restore();
        });

        it("checks a the page handles a create error appropriately.", function () {
            const newSource = sinon.spy();
            const goToLogs = sinon.spy();
            const wrapper = shallow(
                <NewSourcePage
                    newSource={newSource}
                    goToLogs={goToLogs}
                    sources={[]} />
            );

            wrapper.find("NewSkillForm").simulate("createSource", partialSource);

            return completePromise.catch(() => {
                // It's silly but we need to catch this promise here so the other promise can catch *it's* error and continue on with the test.
            }).then(() => {
                wrapper.update();
                let source = wrapper.state("source");
                let error = wrapper.state("error");
                console.log(wrapper.state("error"));
                expect(wrapper.find("NewSkillForm")).to.have.length(1);
                expect(wrapper.find("CodeForm")).to.have.length(0);
                expect(source).to.be.undefined;
                expect(error).to.not.be.undefined;
                expect(newSource).to.not.be.called;
            });
        });
    });

    describe("Tests that ensure the validator function only allows passwords within the rules.", function () {

        let nameRule: SourceNameRule;
        let invalidChars = "!@#$%^&*()_+={}[];:'\"<,>.?/|\\~`";

        before(function () {
            nameRule = new SourceNameRule;
        });

        it("Tests the \"At leat 3 rule\"", function () {
            let maxLength = 50;
            let count = 0;
            let name = "";
            for (; count < 3; ++count) {
                expect(validator(name)).to.be.false;
                name += "A";
            }
            for (; count < maxLength; ++count) {
                expect(validator(name)).to.be.true;
                name += "A";
            }
        });

        it("Tests the \"No special characters except hyphen\" rule.", function () {
            let base = "ABC";
            for (let i = 0; i < invalidChars.length; ++i) {
                expect(validator(base + invalidChars.charAt(i))).to.be.false;
            }

            // And then the hyphen
            expect(validator(base + "-")).to.be.true;
        });

        it("Tests the \"Allows numbers\" rule.", function () {
            expect(validator("0123456789")).to.be.true;
        });

        it("Tests that it does not allow whitespace on ends.", function () {
            expect(validator(" ABC")).to.be.false;
            expect(validator("ABC ")).to.be.false;
        });

        it("Tests that it allows whitepsace inside name.", function () {
            expect(validator("This should be a valid name")).to.be.true;
        });

        function validator(input?: string): boolean {
            return nameRule.regex.test(input);
        }
    });
});