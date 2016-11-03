import * as chai from "chai";
import { shallow } from "enzyme";
// tslint:disable:no-unused-variable
import * as React from "react"; // Needed for enzyme, unused for some reason.
// tslint:enable:no-unused-variable
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

import FormInput from "./FormInput";

// Setup chai with sinon-chai
chai.use(sinonChai);
let expect = chai.expect;

describe("FormInput", function () {
    it("should render correctly", function () {
        let value = "value";
        const onChange = sinon.spy();
        const wrapper = shallow(
            <FormInput
                type={"text"}
                label={"Label"}
                value={value}
                onChange={onChange}
                />
        );

        expect(wrapper.type()).to.equal("div");
        expect(wrapper.props().className).to.equal("mdl-textfield mdl-js-textfield");

        expect(wrapper.find("input")).to.have.length(1);
        expect(wrapper.find("label")).to.have.length(1);

        let input = wrapper.find("input");
        expect(input.props().autoComplete).to.equal("off");
        expect(input.props().type).to.equal("text");
        expect(input.props().id).to.equal("label");
        expect(input.props().value).to.equal("value");
        expect(input.props().onChange).to.equal(onChange);

        let label = wrapper.find("label");
        expect(label.props().htmlFor).to.equal("label");
        expect(label.props().children).to.equal("Label");
    });

    describe("with floatingLabel = true", function () {
        it("renders correctly", function () {
            let value = "value";
            const onChange = sinon.spy();
            const wrapper = shallow(
                <FormInput
                    type={"text"}
                    label={"Label"}
                    value={value}
                    onChange={onChange}
                    floatingLabel={true}
                    />
            );

            expect(wrapper.type()).to.equal("div");
            expect(wrapper.props().className).to.equal("mdl-textfield mdl-js-textfield mdl-textfield--floating-label");
        });
    });
    describe("with style overrides", function () {
        it("renders correctly", function () {
            let value = "value";
            const onChange = sinon.spy();
            const wrapper = shallow(
                <FormInput
                    type={"text"}
                    label={"Label"}
                    value={value}
                    onChange={onChange}
                    floatingLabel={true}
                    style={{ display: "none" }}
                    />
            );

            expect(wrapper.type()).to.equal("div");
            expect(wrapper.props().style).to.eql({ display: "none" });
        });
    });

    describe("with autocomplete = on", function () {
        it("renders correctly", function () {
            let value = "value";
            const onChange = sinon.spy();
            const wrapper = shallow(
                <FormInput
                    type={"text"}
                    label={"Label"}
                    value={value}
                    onChange={onChange}
                    autoComplete={"on"}
                    />
            );

            let input = wrapper.find("input");
            expect(input.props().autoComplete).to.equal("on");
        });
    });
    describe("with readonly = true", function () {
        it("renders correctly", function () {
            let value = "value";
            const onChange = sinon.spy();
            const wrapper = shallow(
                <FormInput
                    type={"text"}
                    label={"Label"}
                    value={value}
                    onChange={onChange}
                    readOnly={true}
                    />
            );

            let input = wrapper.find("input");
            expect(input.props().readOnly).to.equal(true);
        });
    });
});