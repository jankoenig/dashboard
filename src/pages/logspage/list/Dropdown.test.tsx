import * as chai from "chai";
import { shallow, ShallowWrapper } from "enzyme";
import * as React from "react";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

import Conversation, { createConvo } from "../../../models/conversation";
import { alexaRequestIntentLog, alexaResponseLog } from "../../../utils/test";
import Dropdown from "./Dropdown";

chai.use(sinonChai);
const expect = chai.expect;

describe("Dropdown", function () {

    let onClick: Sinon.SinonStub;
    let conversation: Conversation;

    before(function () {
        onClick = sinon.stub();
        conversation = createConvo({ request: alexaRequestIntentLog(), response: alexaResponseLog() });
    });

    afterEach(function () {
        onClick.reset();
    });

    it("Shows dropdown with all props true.", function () {
        const wrapper: ShallowWrapper<any, any> = shallow(<Dropdown
            conversation={conversation}
            active={true}
            showInteractionOnActive={true}
            onClick={onClick} />);

        expect(wrapper.find("ActualComponent")).to.have.length(1);
    });

    it("Does not show dropdown with 'active' false.", function() {
        const wrapper: ShallowWrapper<any, any> = shallow(<Dropdown
            conversation={conversation}
            active={false}
            showInteractionOnActive={true}
            onClick={onClick} />);

        expect(wrapper.find("ActualComponent")).to.have.length(0);
    });

    it("Does not show dropdown with 'showInteractionOnActive' false.", function() {
        const wrapper: ShallowWrapper<any, any> = shallow(<Dropdown
            conversation={conversation}
            active={true}
            showInteractionOnActive={false}
            onClick={onClick} />);

        expect(wrapper.find("ActualComponent")).to.have.length(0);
    });

    it("Shows dropdown on props switch of `active` from `false` to `true`", function() {
        const wrapper: ShallowWrapper<any, any> = shallow(<Dropdown
            conversation={conversation}
            active={false}
            showInteractionOnActive={true}
            onClick={onClick} />);

        wrapper.setProps({conversation: conversation, active: true, showInteractionOnActive: true, onClick: onClick});

        expect(wrapper.find("ActualComponent")).to.have.length(1);
    });

    it("Shows dropdown on props switch of `showInteractionOnActive` from `false` to `true`", function() {
        const wrapper: ShallowWrapper<any, any> = shallow(<Dropdown
            conversation={conversation}
            active={true}
            showInteractionOnActive={false}
            onClick={onClick} />);

        wrapper.setProps({conversation: conversation, active: true, showInteractionOnActive: true, onClick: onClick});

        expect(wrapper.find("ActualComponent")).to.have.length(1);
    });

    it("Stops dropdown on props switch of `active` from `false` to `true`", function() {
        const wrapper: ShallowWrapper<any, any> = shallow(<Dropdown
            conversation={conversation}
            active={true}
            showInteractionOnActive={true}
            onClick={onClick} />);

        wrapper.setProps({conversation: conversation, active: false, showInteractionOnActive: true, onClick: onClick});

        expect(wrapper.find("ActualComponent")).to.have.length(0);
    });

    it("Checks onClick is called.", function() {
        const wrapper: ShallowWrapper<any, any> = shallow(<Dropdown
            conversation={conversation}
            active={true}
            showInteractionOnActive={true}
            onClick={onClick} />);

        wrapper.find("ActualComponent").at(0).simulate("click");

        expect(onClick).to.be.calledOnce;
    });
});