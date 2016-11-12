import { expect } from "chai";

import { requestIntentLog, requestLaunchIntentLog, requestPlayerLog, responseLog, responsePlayerLog } from "../utils/test";
import Conversation from "./conversation";
// import Output from "./output";

describe("Conversation", function () {
    it("sets the properties", function () {

        let response = responseLog;
        let request = requestIntentLog;
        // let outputs = [new Output()];

        let conversation = new Conversation({ response: response, request: request });

        expect(conversation).to.exist;
        expect(conversation.request).to.exist;
        expect(conversation.response).to.exist;

        expect(conversation.applicationId).to.equal("amzn1.ask.skill.07dc249f-caf2-4fc0-bdbe-32b6702426ea");
        expect(conversation.sessionId).to.equal("SessionId.c5f6c9d5-e923-4305-9804-defee172386e");
        expect(conversation.userId).to.equal("amzn1.ask.account.AFP3ZWPOS2BGJR7OWJZ3DHPKMOMBGMYLIYKQUSZHAIR7ALWSV5B2MPTYCUZWZBNUJ3GFOZP6NOCGKQCA73Z2CS4II6OO5NQDUH52YC7UFM2ADB4WTMB66R5UONMNIZMS3NRHCTQXEUPMOQDRH3XSBXZWMGGZDSQA7R7E4EPA4IHO7FP6ANM7NFX7U7RQQ37AWQDI334WGWDJ63A");
        expect(conversation.requestType).to.equal("IntentRequest");
        expect(conversation.intent).to.equal("HelloWorldIntent");
        expect(conversation.timestamp).to.equal(request.timestamp);
    });
    describe("with launch intent request", function () {
        it("returns undefined for intent", function () {

            let response = responseLog;
            let request = requestLaunchIntentLog;

            let conversation = new Conversation({ response: response, request: request });

            expect(conversation.intent).to.be.undefined;

        });
    });
    describe("with request from player", function() {
        it("sets the userId", function() {
            let conversation = new Conversation({ response: responsePlayerLog, request: requestPlayerLog});
            expect(conversation.userId).to.equal("amzn1.ask.account.1237345d-bb6a-470a-b5fd-40dd148390a7");
        });
    });
});