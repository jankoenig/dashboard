import * as chai from "chai";
import { shallow, ShallowWrapper } from "enzyme";
import * as React from "react";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

import Checkbox from "react-toolbox/lib/checkbox";
import SourceOriginSelector, { Box, SourceOption } from "./SourceOriginSelector";

chai.use(sinonChai);
const expect = chai.expect;

const options: SourceOption[] = [{
    label: "All",
    theme: "AllTheme",
    checked: true
}, {
    label: "Amazon",
    theme: "AmazonTheme",
    checked: true
}, {
    label: "Google",
    theme: "GoogleTheme",
    checked: true
}];

describe("SourceOriginSelector", function () {
    describe("Render", function () {
        let onChecked: Sinon.SinonStub;
        let wrapper: ShallowWrapper<any, any>;

        before(function () {
            onChecked = sinon.stub();
        });

        beforeEach(function () {
            onChecked.reset();
            wrapper = shallow(
                <SourceOriginSelector
                    options={options}
                    onCheck={onChecked} />
            );
        });

        it("Ensures the boxes are created.", function () {
            expect(wrapper.find(Box)).to.have.length(3);
        });

        it("Ensures the boxes have their props", function () {
            const boxes = wrapper.find(Box);
            for (let i = 0; i < boxes.length; ++i) {
                const box = wrapper.find(Box).at(i);
                const props = options[i];
                expect(box).to.have.prop("option", props);
            }
        });

        describe("Box", function () {
            it("Tests that the box sends the appropriate parameters", function () {
                const handleChange = sinon.stub();
                const boxWrapper = shallow(<Box index={2} option={{ label: "Test box", theme: "testTheme", checked: false }} onChange={handleChange} />);

                boxWrapper.find(Checkbox).at(0).simulate("change", true);

                expect(handleChange).to.be.calledWith(2, "Test box", true);
            });

            it("Tests that the box send the appropriate props to the checkbox.", function () {
                const handleChange = sinon.stub();
                const boxWrapper = shallow(<Box index={2} option={{ label: "Test box", theme: "testTheme", checked: false }} onChange={handleChange} />);

                const checkbox = boxWrapper.find(Checkbox).at(0);
                expect(checkbox).to.have.prop("theme", "testTheme");
                expect(checkbox).to.have.prop("checked", false);
                expect(checkbox).to.have.prop("label", "Test box");
            });
        });

        describe("events", function () {
            it("tests that clicking on a checkbox yields the proper result.", function () {
                const boxes = wrapper.find(Box);
                boxes.at(0).simulate("change", 0, options[0].label, false);
                boxes.at(1).simulate("change", 1, options[1].label, false);
                boxes.at(2).simulate("change", 2, options[2].label, false);

                expect(onChecked).to.be.calledThrice;
                expect(onChecked.args[0][0]).to.equal(0);
                expect(onChecked.args[0][1]).to.equal(options[0].label);
                expect(onChecked.args[0][2]).to.equal(false);
                expect(onChecked.args[1][0]).to.equal(1);
                expect(onChecked.args[1][1]).to.equal(options[1].label);
                expect(onChecked.args[1][2]).to.equal(false);
                expect(onChecked.args[2][0]).to.equal(2);
                expect(onChecked.args[2][1]).to.equal(options[2].label);
                expect(onChecked.args[2][2]).to.equal(false);
            });
        });
    });
});