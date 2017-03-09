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
    });
});