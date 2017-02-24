import * as chai from "chai";
import { shallow, ShallowWrapper } from "enzyme";
import * as React from "react";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

import Conversation, { createConvo } from "../../../models/conversation";
import { alexaRequestIntentLog, alexaResponseLog } from "../../../utils/test";
import ConvoListItem from "./ConvoListItem";
import ConvoMainContent from "./ConvoMainContent";
import ConvoPill from "./ConvoPill";
import Dropdown from "./Dropdown";

chai.use(sinonChai);
const expect = chai.expect;

const iconStyle = {
    width: "100px",
    height: "1200px"
};

describe("ConvoListItem", function () {

    let onClick: Sinon.SinonStub;
    let onIconClick: Sinon.SinonStub;
    let conversation: Conversation;

    before(function () {
        onClick = sinon.stub();
        onIconClick = sinon.stub();
        conversation = createConvo({ request: alexaRequestIntentLog(), response: alexaResponseLog() });
    });

    afterEach(function () {
        onClick.reset();
        onIconClick.reset();
    });

    describe("Render", function () {
        let wrapper: ShallowWrapper<any, any>;

        describe("Inactive", function () {
            before(function () {
                wrapper = shallow(<ConvoListItem
                    conversation={conversation}
                    onClick={onClick}
                    onIconClick={onIconClick}
                    iconTooltip={"TestTooltip"}
                    iconStyle={iconStyle}
                    active={false}
                    showInteractionOnActive={true} />
                );
            });

            it("Tests the background is faded", function () {
                expect(wrapper.find("div").at(0)).to.have.style("background-color", "#FAFAFA");
            });
        });

        describe("Active", function () {

            before(function () {
                wrapper = shallow(<ConvoListItem
                    conversation={conversation}
                    onClick={onClick}
                    onIconClick={onIconClick}
                    iconTooltip={"TestTooltip"}
                    iconStyle={iconStyle}
                    active={true}
                    showInteractionOnActive={true} />
                );
            });

            describe("root", function () {
                it("Proves that it's actually an li item", function () {
                    expect(wrapper.find("li")).to.have.length(1);
                });

                it("Passes the click up.", function () {
                    // The dropdown is actually out of the root so that the user can click on it without closing it.
                    const root = wrapper.find("div").at(0);

                    root.simulate("click");

                    expect(onClick).to.have.been.calledOnce;
                    expect(onClick).to.have.been.calledWith;
                });

                it("Tests the background is normal", function () {
                    expect(wrapper.find("div").at(0)).to.have.style("background-color", "#90A4AE");
                });
            });

            describe("Main content", function () {
                it("Shows the main content.", function () {
                    expect(wrapper.find(ConvoMainContent)).to.have.length(1);
                });

                it("Passes the appropriate props.", function () {
                    const mainWrapper = wrapper.find(ConvoMainContent).at(0);
                    expect(mainWrapper).to.have.prop("conversation", conversation);
                    expect(mainWrapper).to.have.prop("iconStyle", iconStyle);
                    expect(mainWrapper).to.have.prop("iconTooltip", "TestTooltip");
                });

                it("Tests the onItemClick", function () {
                    const mainWrapper = wrapper.find(ConvoMainContent).at(0);
                    mainWrapper.simulate("iconClick");

                    expect(onIconClick).to.have.been.calledOnce;
                    expect(onIconClick).to.have.been.calledWith(conversation);
                });
            });

            describe("Convo pill", function () {
                it("Tests the error pill properties", function () {
                    const errorPill = wrapper.find(ConvoPill).at(0);

                    expect(errorPill).to.have.prop("show", conversation.hasError);
                    expect(errorPill).to.have.prop("text", "error");
                });

                it("Tests the exception pill properties", function () {
                    const errorPill = wrapper.find(ConvoPill).at(1);

                    expect(errorPill).to.have.prop("show", conversation.hasException);
                    expect(errorPill).to.have.prop("text", "exception");
                });
            });

            describe("Dropdown", function () {
                it("Passes the dropdown props.", function () {
                    const dropdown = wrapper.find(Dropdown).at(0);

                    expect(dropdown).to.have.prop("conversation", conversation);
                    expect(dropdown).to.have.prop("showInteractionOnActive", true);
                    expect(dropdown).to.have.prop("active", true);
                });

                it("Checks the onClick", function () {
                    const dropdown = wrapper.find(Dropdown).at(0);

                    dropdown.simulate("click");

                    expect(onClick).to.have.been.calledOnce;
                    expect(onClick).to.have.been.calledWith;
                });
            });
        });
    });
});