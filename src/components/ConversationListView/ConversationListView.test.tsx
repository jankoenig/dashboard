import * as chai from "chai";
import { shallow } from "enzyme";
// tslint:disable:no-unused-variable
import * as React from "react"; // Needed for enzyme, unused for some reason.
// tslint:enable:no-unused-variable
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

import ConversationList from "../../models/conversation-list";
import { dummyLogs } from "../../utils/test";
import ConversationListView from "./ConversationListView";

// Setup chai with sinon-chai
chai.use(sinonChai);
let expect = chai.expect;

describe("ConversationListView", function () {
    describe("with logs", function () {
        it("renders correctly", function () {
            let logs = dummyLogs(4);
            let conversations = ConversationList.fromLogs(logs);
            let onClick = sinon.spy();
            const wrapper = shallow(<ConversationListView conversations={conversations} onClick={onClick} />);

            expect(wrapper.find("ConversationListViewItem")).to.have.length(2);
            expect(wrapper.find("p")).to.have.length(0);
        });
    });
    describe("without logs", function () {
        it("renders correctly", function() {
            let onClick = sinon.spy();
            const wrapper = shallow(<ConversationListView conversations={[]} onClick={onClick} />);

            expect(wrapper.find("ConversationListViewItem")).to.have.length(0);
            expect(wrapper.find("p")).to.have.length(1);
        });
    });
});