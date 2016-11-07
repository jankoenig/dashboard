import { expect } from "chai";

import Conversation from "./conversation";
import Log, { LogProperties } from "./log";

let requestPropertiesLaunch: LogProperties = {
    payload: {
        "version": "1.0",
        "session": {
            "new": true,
            "sessionId": "amzn1.echo-api.session.984a55a5-7df5-4373-9591-514f76c99de7",
            "application": {
                "applicationId": "amzn1.ask.skill.07dc249f-caf2-4fc0-bdbe-32b6702426ea"
            },
            "user": {
                "userId": "amzn1.ask.account.AFP3ZWPOS2BGJR7OWJZ3DHPKMOMBGMYLIYKQUSZHAIR7ALWSV5B2MPTYCUZWZBNUJ3GFOZP6NOCGKQCA73Z2CS4II6OO5NQDUH52YC7UFM2ADB4WTMB66R5UONMNIZMS3NRHCTQXEUPMOQDRH3XSBXZWMGGZDSQA7R7E4EPA4IHO7FP6ANM7NFX7U7RQQ37AWQDI334WGWDJ63A"
            }
        },
        "context": {
            "AudioPlayer": {
                "playerActivity": "IDLE"
            },
            "System": {
                "application": {
                    "applicationId": "amzn1.ask.skill.07dc249f-caf2-4fc0-bdbe-32b6702426ea"
                },
                "user": {
                    "userId": "amzn1.ask.account.AFP3ZWPOS2BGJR7OWJZ3DHPKMOMBGMYLIYKQUSZHAIR7ALWSV5B2MPTYCUZWZBNUJ3GFOZP6NOCGKQCA73Z2CS4II6OO5NQDUH52YC7UFM2ADB4WTMB66R5UONMNIZMS3NRHCTQXEUPMOQDRH3XSBXZWMGGZDSQA7R7E4EPA4IHO7FP6ANM7NFX7U7RQQ37AWQDI334WGWDJ63A"
                }
            }
        },
        "request": {
            "type": "LaunchRequest",
            "requestId": "amzn1.echo-api.request.943961c5-52e1-4485-a71a-e592ba5e646e",
            "timestamp": "2016-11-03T21:22:53Z",
            "locale": "en-US"
        }
    },
    log_type: "INFO",
    source: "source",
    transaction_id: "N/A",
    timestamp: new Date("2016-11-03T21:22:54.186Z"),
    tags: [
        "request"
    ],
    id: "581baaae7a0db10022c0805b"
};

let requestPropertiesIntent: LogProperties = {
    payload: {
        "version": "1.0",
        "session": {
            "new": true,
            "sessionId": "SessionId.c5f6c9d5-e923-4305-9804-defee172386e",
            "application": {
                "applicationId": "amzn1.ask.skill.07dc249f-caf2-4fc0-bdbe-32b6702426ea"
            },
            "user": {
                "userId": "amzn1.ask.account.AFP3ZWPOS2BGJR7OWJZ3DHPKMOMBGMYLIYKQUSZHAIR7ALWSV5B2MPTYCUZWZBNUJ3GFOZP6NOCGKQCA73Z2CS4II6OO5NQDUH52YC7UFM2ADB4WTMB66R5UONMNIZMS3NRHCTQXEUPMOQDRH3XSBXZWMGGZDSQA7R7E4EPA4IHO7FP6ANM7NFX7U7RQQ37AWQDI334WGWDJ63A"
            }
        },
        "request": {
            "type": "IntentRequest",
            "requestId": "EdwRequestId.31918331-641e-4482-89ff-a1c72ef86ed6",
            "timestamp": "2016-11-04T18:18:44Z",
            "locale": "en-US",
            "intent": {
                "name": "HelloWorldIntent"
            }
        }
    },
    log_type: "INFO",
    source: "source",
    transaction_id: "N/A",
    timestamp: new Date("2016-11-04T18:18:44.510Z"),
    tags: [
        "request"
    ],
    id: "581cd1047a0db10022c081e7"
};

let responsePayload: LogProperties = {
    payload: {
        "version": "1.0",
        "response": {
            "outputSpeech": {
                "type": "SSML",
                "ssml": "<speak> Oh boy, what a demo </speak>"
            },
            "shouldEndSession": true
        }
    },
    log_type: "INFO",
    source: "source",
    transaction_id: "N/A",
    timestamp: new Date("2016-11-04T18:18:44.511Z"),
    tags: [
        "response"
    ],
    id: "581cd1047a0db10022c081e8"
};

describe.only("Conversation", function () {
    it("sets the properties", function () {

        let response = new Log(responsePayload);
        let request = new Log(requestPropertiesIntent);

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

            let response = new Log(responsePayload);
            let request = new Log(requestPropertiesLaunch);

            let conversation = new Conversation({ response: response, request: request });

            expect(conversation.intent).to.be.undefined;

        });
    });
});