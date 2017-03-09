import * as chai from "chai";
import { shallow, ShallowWrapper } from "enzyme";
import * as React from "react";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

import Checkbox from "react-toolbox/lib/checkbox";
import SourceOriginSelector, { SourceOption } from "./SourceOriginSelector";

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

        before(function() {
            onChecked = sinon.stub();
        });

        beforeEach(function () {
            onChecked.reset();
            wrapper = shallow(
                <SourceOriginSelector
                    options={options}
                    onChecked={onChecked} />
            );
        });

        it("Ensures the boxes are created.", function() {
            expect(wrapper.find(Checkbox)).to.have.length(3);
        });

        it("Ensures the boxes have their props", function() {
            const boxes = wrapper.find(Checkbox);
            for (let i = 0; i < boxes.length; ++i) {
                const box = wrapper.find(Checkbox).at(i);
                const props = options[i];
                expect(box).to.have.prop("label", props.label);
                expect(box).to.have.prop("checked", props.checked);
                expect(box).to.have.prop("theme", props.theme);
            }
        });

        describe("events", function() {
            it("tests that clicking on a checkbox yields the proper result.", function() {
                const boxes = wrapper.find(Checkbox);
                boxes.at(0).simulate("change");
                boxes.at(1).simulate("change");
                boxes.at(2).simulate("change");

                expect(onChecked).to.be.calledThrice;
                expect(onChecked.args[0][0]).to.equal(0);
                expect(onChecked.args[0][1]).to.equal(options[0].label);
                expect(onChecked.args[1][0]).to.equal(1);
                expect(onChecked.args[1][1]).to.equal(options[1].label);
                expect(onChecked.args[2][0]).to.equal(2);
                expect(onChecked.args[2][1]).to.equal(options[2].label);
            });
        });
    });
});