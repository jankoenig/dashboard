import * as chai from "chai";
import { shallow, ShallowWrapper } from "enzyme";
import * as React from "react";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

import Conversation from "../../../models/conversation";
import ConversationList from "../../../models/conversation-list";
import browser from "../../../utils/browser";
import { dummyConversationList } from "../../../utils/test";
import { Filter } from "../filters/Filters";
import ConvoList from "./ConvoList";
import FilterableConvoList from "./FilterableConvoList";

chai.use(sinonChai);
const expect = chai.expect;

const iconStyle = {
    width: "100%",
    height: "200px"
};

const tooltip = "TestTooltip";

describe("FilterableconvoList", function () {
    let conversations: ConversationList;
    let isMobileWidth: Sinon.SinonStub;
    let onItemClick: Sinon.SinonStub;
    let onIconClick: Sinon.SinonStub;
    let onItemsFiltered: Sinon.SinonStub;
    let onScroll: Sinon.SinonStub;
    let filter: Filter<Conversation>;

    before(function () {
        conversations = dummyConversationList(10);
        isMobileWidth = sinon.stub(browser, "isMobileWidth").returns(true);
        onItemClick = sinon.stub();
        onIconClick = sinon.stub();
        onItemsFiltered = sinon.stub();
        onScroll = sinon.stub();
    });

    afterEach(function () {
        onIconClick.reset();
        onItemClick.reset();
        onItemsFiltered.reset();
        onScroll.reset();
    });

    after(function () {
        isMobileWidth.restore();
    });

    describe("Render", function () {
        let wrapper: ShallowWrapper<any, any>;

        beforeEach(function () {
            wrapper = shallow(<FilterableConvoList
                conversations={conversations}
                iconStyle={iconStyle}
                iconTooltip={tooltip}
                filter={filter}
                onItemClick={onItemClick}
                onIconClick={onIconClick}
                onItemsFiltered={onItemsFiltered}
                onScroll={onScroll} />);
        });

        it("Checks that the ConvoList exists", function () {
            expect(wrapper.find(ConvoList)).to.have.length(1);
        });

        it("Checks that the appropriate props are passed to the list.", function () {
            const listWrapper = wrapper.find(ConvoList).at(0);

            const convos = listWrapper.prop("conversations");
            expect(convos).to.deep.equal(conversations);

            // The rest should be the same references
            expect(listWrapper).to.have.prop("iconStyle", iconStyle);
            expect(listWrapper).to.have.prop("iconTooltip", tooltip);
            expect(listWrapper).to.have.prop("onClick", onItemClick);
            expect(listWrapper).to.have.prop("onScroll", onScroll);
            expect(listWrapper).to.have.prop("expandListItemWhenActive", true);
        });
    });

    describe("Filter", function () {
        it("Tests nothing is filtered when filter is undefined", function () {
            const wrapper = shallow(<FilterableConvoList
                filter={undefined}
                conversations={conversations}
                iconStyle={iconStyle}
                iconTooltip={tooltip}
                onItemClick={onItemClick}
                onIconClick={onIconClick}
                onItemsFiltered={onItemsFiltered}
                onScroll={onScroll} />);

            const convoList = wrapper.find(ConvoList);
            const convos = convoList.prop("conversations");

            expect(convos).to.deep.equal(conversations);
        });

        it("Tests that items are filtered with a props change.", function () {
            let counter = 0;
            const filter: Filter<Conversation> = {
                type: "Test",
                filter: function (c: Conversation): boolean {
                    return (counter++ % 2) === 0;
                }
            };

            const wrapper = shallow(<FilterableConvoList
                filter={undefined}
                conversations={conversations}
                iconStyle={iconStyle}
                iconTooltip={tooltip}
                onItemClick={onItemClick}
                onIconClick={onIconClick}
                onItemsFiltered={onItemsFiltered}
                onScroll={onScroll} />);

            const newProps = { ...wrapper.props(), ...{ filter: filter } };
            wrapper.setProps(newProps);

            return Promise.resolve(true).then(function () {
                const convoList = wrapper.find(ConvoList);
                const convos = convoList.prop("conversations");
                expect(convos).to.have.length(conversations.length / 2);
            });
        });
    });
});