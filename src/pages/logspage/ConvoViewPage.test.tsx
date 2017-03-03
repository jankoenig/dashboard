import * as chai from "chai";
import { shallow, ShallowWrapper } from "enzyme";
import * as React from "react";

import Interaction from "../../components/Interaction";
import Conversation from "../../models/conversation";
import { dummyConversationList } from "../../utils/test";
import ConvoViewPage from "./ConvoViewPage";

const expect = chai.expect;

describe("ConvoViewPage", function () {

    describe("Render", function () {
        let wrapper: ShallowWrapper<any, any>;

        describe("With Convo", function () {
            let conversation: Conversation;

            beforeEach(function () {
                conversation = dummyConversationList(1)[0];
                wrapper = shallow(<ConvoViewPage
                    conversation={conversation} />);
            });

            it("tests the Interaction is shown", function () {
                expect(wrapper.find(Interaction)).to.have.length(1);
            });

            it("tests the Interaction has the appropriate props.", function() {
                const interactionWrapper = wrapper.find(Interaction).at(0);
                expect(interactionWrapper).to.have.prop("request", conversation.request);
                expect(interactionWrapper).to.have.prop("response", conversation.response);
                expect(interactionWrapper).to.have.prop("outputs", conversation.outputs);
                expect(interactionWrapper).to.have.prop("stackTraces", conversation.stackTraces);
            });
        });
    });
});