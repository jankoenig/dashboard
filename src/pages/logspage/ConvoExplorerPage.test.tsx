import * as chai from "chai";
import { shallow, ShallowWrapper } from "enzyme";
import * as React from "react";
import * as sinon from "sinon";

import Conversation from "../../models/conversation";
import { dummyConversationList } from "../../utils/test";
import ConvoExplorerPage from "./ConvoExplorerPage";
import ConvoListPage from "./ConvoListPage";
import ConvoViewPage from "./ConvoViewPage";
import { CompositeFilter } from "./filters/Filters";

const expect = chai.expect;

const iconTooltip = "TestTooltip";
const iconStyle = {
    width: "100%",
    height: "100px"
};

describe("ConvoExplorerPage", function () {
    let onIconClick: sinon.SinonStub;

    before(function () {
        onIconClick = sinon.stub();
    });

    afterEach(function () {
        onIconClick.reset();
    });

    describe("Render", function () {
        let compositeFilter: CompositeFilter<Conversation>;
        let wrapper: ShallowWrapper<any, any>;

        before(function () {
            compositeFilter = new CompositeFilter([]);
        });

        beforeEach(function () {
            wrapper = shallow(<ConvoExplorerPage
                onIconClick={onIconClick}
                refreshOn={true}
                filter={compositeFilter}
                iconStyle={iconStyle}
                iconTooltip={iconTooltip} />);
        });

        it("Tests that the List page exists.", function () {
            expect(wrapper.find(ConvoListPage)).to.have.length(1);
        });

        it("Tests that the view page exists.", function () {
            expect(wrapper.find(ConvoViewPage)).to.have.length(1);
        });

        it("Tests the props are sent to the list page.", function () {
            const page = wrapper.find(ConvoListPage).at(0);
            expect(page).to.have.prop("filter", compositeFilter);
            expect(page).to.have.prop("refreshOn", true);
            expect(page).to.have.prop("onIconClick", onIconClick);
            expect(page).to.have.prop("iconTooltip", iconTooltip);
            expect(page).to.have.prop("iconStyle", iconStyle);
        });
    });

    describe("Actions", function () {
        let convo: Conversation;
        let wrapper: ShallowWrapper<any, any>;

        beforeEach(function () {
            convo = dummyConversationList(1)[0];
            wrapper = shallow(<ConvoExplorerPage
                onIconClick={onIconClick} />);
        });

        it("Tests that clicking on an item from the list will select it for the view page.", function () {
            const listWrapper = wrapper.find(ConvoListPage).at(0);

            listWrapper.simulate("itemClick", convo);

            const viewWrapper = wrapper.find(ConvoViewPage).at(0);

            expect(viewWrapper).to.have.prop("conversation", convo);
        });

        it("Tests that clicked on an icon from the list will selected it.", function () {
            const listWrapper = wrapper.find(ConvoListPage).at(0);

            listWrapper.simulate("iconClick", convo);

            expect(onIconClick).to.have.been.calledOnce;
            expect(onIconClick).to.have.been.calledWith;
        });
    });
});