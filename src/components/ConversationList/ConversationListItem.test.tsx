import * as chai from "chai";
import { shallow } from "enzyme";
// tslint:disable:no-unused-variable
import * as React from "react"; // Needed for enzyme, unused for some reason.
// tslint:enable:no-unused-variable
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

import Conversation from "../../models/conversation";
import { requestIntentLog, responseLog } from "../../utils/test";
import ConversationListItem from "./ConversationListItem";

// Setup chai with sinon-chai
chai.use(sinonChai);
let expect = chai.expect;

describe("ConversationListItem", function () {
    it("renders correctly", function () {
        let onClick = sinon.spy();
        let conversation = new Conversation({ request: requestIntentLog, response: responseLog });
        let wrapper = shallow(<ConversationListItem conversation={conversation} onClick={onClick} />);

        expect(wrapper.find("li")).to.have.length(1);
        let li = wrapper.find("li");
        expect(li.props().style.backgroundColor).to.equal("#FAFAFA");
        expect(wrapper.find("Icon")).to.have.length(1);
    });
    describe("when active", function () {
        it("renders the background color", function () {
            let onClick = sinon.spy();
            let conversation = new Conversation({ request: requestIntentLog, response: responseLog });
            let wrapper = shallow(<ConversationListItem conversation={conversation} onClick={onClick} active={true} />);

            expect(wrapper.find("li")).to.have.length(1);
            let li = wrapper.find("li");
            expect(li.props().style.backgroundColor).to.equal("#90A4AE");
        });
    });
});