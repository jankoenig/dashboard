import * as chai from "chai";
import { shallow } from "enzyme";
// tslint:disable:no-unused-variable
import * as React from "react"; // Needed for enzyme, unused for some reason.
// tslint:enable:no-unused-variable
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

import { NewSourcePage, SourceNameRule } from "./NewSourcePage";

// Setup chai with sinon-chai
chai.use(sinonChai);
let expect = chai.expect;

describe("New Source Page", function () {
    it("should render correctly", function () {
        const newSource = sinon.spy();
        const goToLogs = sinon.spy();
        const wrapper = shallow(
            <NewSourcePage
                newSource={newSource}
                goToLogs={goToLogs}
                sources = {[]}/>
        );
        expect(wrapper.find("SourceForm")).to.have.length(1);
    });

    describe("Tests that ensure the validator function only allows passwords within the rules.", function() {

        let nameRule: SourceNameRule;
        let invalidChars = "!@#$%^&*()_+={}[];:'\"<,>.?/|\\~`";

        before(function() {
            nameRule = new SourceNameRule;
        });

        it ("Tests the \"At leat 3 rule\"", function() {
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

        it ("Tests the \"No special characters except hyphen\" rule.", function() {
            let base = "ABC";
            for (let i = 0; i < invalidChars.length; ++i) {
                expect(validator(base + invalidChars.charAt(i))).to.be.false;
            }

            // And then the hyphen
            expect(validator(base + "-")).to.be.true;
        });

        it ("Tests the \"Allows numbers\" rule.", function() {
            expect(validator("0123456789")).to.be.true;
        });

        it ("Tests that it does not allow whitespace on ends.", function() {
            expect(validator(" ABC")).to.be.false;
            expect(validator("ABC ")).to.be.false;
        });

        it ("Tests that it allows whitepsace inside name.", function() {
            expect(validator("This should be a valid name")).to.be.true;
        });

        function validator(input?: string): boolean {
            return nameRule.regex.test(input);
        }
    });
});