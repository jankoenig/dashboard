import * as chai from "chai";

import { dummyLogs } from "../utils/test";
import ConversationList from "./conversation-list";
import ConversationListSummary from "./conversation-list-summary";

let expect = chai.expect;

describe("ConversationListSummary", function () {

    let logs = dummyLogs(10);
    let conversations = ConversationList.fromLogs(logs);
    let endTime = new Date();
    let startTime = new Date();
    startTime.setHours(endTime.getHours() - 2);
    let conversationListSummary = new ConversationListSummary({
        startTime: startTime, endTime: endTime
    }, conversations);

    it("returns the event label", function (){
        expect(conversationListSummary.eventLabel).to.equal("Conversations");
    });
    it("returns the total number of events", function() {
        expect(conversationListSummary.totalEvents).to.equal(5);
    });
    it("returns the correct event data", function() {
        expect(conversationListSummary.events).to.have.length(3);
        expect(conversationListSummary.events[2].data).to.have.length(5);
    });
    it("returns total exceptions", function() {
        expect(conversationListSummary.totalExceptions).to.equal(0);
    });
    it("returns unique users", function() {
        expect(conversationListSummary.totalUniqueUsers).to.equal(1);
    });
    it("returns the requests", function() {
        expect(conversationListSummary.requests).to.have.length(5);
    });
});

