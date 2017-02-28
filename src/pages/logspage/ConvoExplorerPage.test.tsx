import * as chai from "chai";
import { shallow, ShallowWrapper } from "enzyme";
import * as React from "react";

import Conversation from "../../models/Conversation";
import { dummyConversationList } from "../../utils/test";
import ConvoExplorerPage from "./ConvoExplorerPage";
import ConvoListPage from "./ConvoListPage";
import ConvoViewPage from "./ConvoViewPage";

const expect = chai.expect;

describe("ConvoExplorerPage", function () {
    describe("Render", function () {
        let wrapper: ShallowWrapper<any, any>;

        beforeEach(function () {
            wrapper = shallow(<ConvoExplorerPage />);
        });

        it("Tests that the List page exists.", function () {
            expect(wrapper.find(ConvoListPage)).to.have.length(1);
        });

        it("Tests that the view page exists.", function () {
            expect(wrapper.find(ConvoViewPage)).to.have.length(1);
        });
    });

    describe("Actions", function () {
        let convo: Conversation;
        let wrapper: ShallowWrapper<any, any>;

        beforeEach(function () {
            convo = dummyConversationList(1)[0];
            wrapper = shallow(<ConvoExplorerPage />);
        });

        it("Tests that clicking on an item from the list will select it for the view page.", function() {
            const listWrapper = wrapper.find(ConvoListPage).at(0);

            listWrapper.simulate("itemClick", convo);

            const viewWrapper = wrapper.find(ConvoViewPage).at(0);

            expect(viewWrapper).to.have.prop("conversation", convo);
        });
    });
});