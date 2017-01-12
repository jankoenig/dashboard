import * as chai from "chai";
import { shallow } from "enzyme";
import * as React from "react";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

import Conversation from "../../models/conversation";
import Log from "../../models/log";
import Output from "../../models/output";
import { requestIntentLog, responseLog } from "../../utils/test";
import ConversationListItem from "./ConversationListViewItem";

// Setup chai with sinon-chai
chai.use(sinonChai);
let expect = chai.expect;

describe("ConversationListViewItem", function () {
    let onClick = sinon.spy();
    let conversation = new Conversation({ request: requestIntentLog, response: responseLog });
    let wrapper = shallow(<ConversationListItem conversation={conversation} onClick={onClick} />);
    let li = wrapper.find("li");
    let div = li.find("div").first();

    it("renders a li", function () {
        expect(li).to.have.length(1);
    });
    it("has the right background color", function () {
        expect(div.props().style.backgroundColor).to.equal("#FAFAFA");
    });
    it("renders the Icon", function () {
        expect(wrapper.find("Icon")).to.have.length(1);
    });
    it("does not render a Pill", function () {
        expect(wrapper.find("Pill")).to.have.length(0);
    });
    it("does not render an Interaction", function () {
        expect(wrapper.find("Interaction")).to.have.length(0);
    });
    it("does not render a Button", function () {
        expect(wrapper.find("Button")).to.have.length(0);
    });

    describe("when active", function () {
        let onClick = sinon.spy();
        let conversation = new Conversation({ request: requestIntentLog, response: responseLog });
        let wrapper = shallow(<ConversationListItem conversation={conversation} onClick={onClick} active={true} />);
        let li = wrapper.find("li");
        let div = li.find("div").first();

        it("renders one li", function () {
            expect(wrapper.find("li")).to.have.length(1);
        });
        it("renders the background color", function () {
            expect(div.props().style.backgroundColor).to.equal("#90A4AE");
        });
        describe("with showInteractionOnActive", function () {

            wrapper.setProps({ showInteractionOnActive: true });

            it("shows the interaction and collapse button", function () {
                expect(wrapper.find("Interaction")).to.have.length(1);
                expect(wrapper.find("Button")).to.have.length(1);
            });
        });
    });
    describe("with a conversation that has an output with an error", function () {
        it("renders the error pill", function () {
            let onClick = sinon.spy();

            let output = new Output({
                message: "Error!",
                level: "ERROR",
                timestamp: new Date(),
                transaction_id: requestIntentLog.id,
                id: "123"
            });

            let conversation = new Conversation({ request: requestIntentLog, response: responseLog, outputs: [output] });
            let wrapper = shallow(<ConversationListItem conversation={conversation} onClick={onClick} active={true} />);

            expect(wrapper.find("Pill")).to.have.length(1);
        });
    });
    describe("with a conversation without a userId", function () {
        it("does not display the icon", function () {
            let onClick = sinon.spy();

            let request = new Log({
                payload: {},
                log_type: "DEBUG",
                source: "source",
                transaction_id: "id",
                timestamp: new Date(),
                tags: [],
                id: "unique"
            });

            let conversation = new Conversation({ request: request, response: responseLog, outputs: [] });
            let wrapper = shallow(<ConversationListItem conversation={conversation} onClick={onClick} active={true} />);

            expect(wrapper.find("Icon")).to.have.length(0);
        });
    });
});