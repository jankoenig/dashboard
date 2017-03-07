import * as chai from "chai";
import { shallow, ShallowWrapper } from "enzyme";
import * as React from "react";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

import AmazonEchoIcon from "../../../components/Icon/AmazonEcho";
import DefaultIcon from "../../../components/Icon/Default";
import GoogleHomeIcon from "../../../components/Icon/GoogleHome";
import { Origin } from "../../../models/conversation";
import ConvoIcon from "./ConvoIcon";

chai.use(sinonChai);
const expect = chai.expect;

const style = {
    width: "100",
    height: "200"
};
const color = "#FFFFFF";
const tooltip = "Tools";

describe("ConvoIcon", function () {

    let onClick: Sinon.SinonStub;

    before(function () {
        onClick = sinon.stub();
    });

    afterEach(function () {
        onClick.reset();
    });

    it("Checks the Google Home Icon is shown when origin is from home.", function () {
        const wrapper: ShallowWrapper<any, any> = shallow(
            <ConvoIcon origin={Origin.GoogleHome} color={color} />);

        expect(wrapper.find(GoogleHomeIcon)).to.have.length(1);
    });

    it("Checks the props are passed from the Icon to the Google Home Icon.", function () {
        const wrapper: ShallowWrapper<any, any> = shallow(
            <ConvoIcon origin={Origin.GoogleHome} color={color} style={style} tooltip={tooltip} onClick={onClick} />);

        const buttonWrapper = wrapper.find(GoogleHomeIcon).at(0);
        expect(buttonWrapper.prop("style")).to.deep.equal(style);
        expect(buttonWrapper.prop("tooltip")).to.equal(tooltip);
        expect(buttonWrapper.prop("onClick")).to.equal(onClick);
        expect(buttonWrapper.prop("color")).to.equal(color);
    });

    it("Checks the Amazon Echo Icon is shown when origin is from Amazon.", function () {
        const wrapper: ShallowWrapper<any, any> = shallow(
            <ConvoIcon origin={Origin.AmazonAlexa} color={color} />);

        expect(wrapper.find(AmazonEchoIcon)).to.have.length(1);
    });

    it("Checks the props are passed from the Icon to the Amazon Icon.", function () {
        const wrapper: ShallowWrapper<any, any> = shallow(
            <ConvoIcon origin={Origin.AmazonAlexa} color={color} style={style} tooltip={tooltip} onClick={onClick} />);

        const buttonWrapper = wrapper.find(AmazonEchoIcon).at(0);
        expect(buttonWrapper.prop("style")).to.deep.equal(style);
        expect(buttonWrapper.prop("tooltip")).to.equal(tooltip);
        expect(buttonWrapper.prop("onClick")).to.equal(onClick);
        expect(buttonWrapper.prop("color")).to.equal(color);
    });

    it("Checks the Default Icon is shown when origin is unknown.", function () {
        const wrapper: ShallowWrapper<any, any> = shallow(
            <ConvoIcon origin={Origin.Unknown} color={color} />);

        expect(wrapper.find(DefaultIcon)).to.have.length(1);
    });

    it("Checks the props are passed from the Icon to the Amazon Icon.", function() {
        const wrapper: ShallowWrapper<any, any> = shallow(
            <ConvoIcon origin={Origin.Unknown} color={color} style={style} tooltip={tooltip} onClick={onClick} />);

        const buttonWrapper = wrapper.find(DefaultIcon).at(0);
        expect(buttonWrapper.prop("style")).to.deep.equal(style);
        expect(buttonWrapper.prop("tooltip")).to.equal(tooltip);
        expect(buttonWrapper.prop("onClick")).to.equal(onClick);
        expect(buttonWrapper.prop("color")).to.equal(color);
    });
});