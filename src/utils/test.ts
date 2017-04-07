import * as uuid from "uuid";

import { LOG_LEVELS } from "../constants";
import ConversationList from "../models/conversation-list";
import Log from "../models/log";
import Output from "../models/output";
import Source from "../models/source";

export enum LogType {
    Alexa, Home
}

/**
 * Returns a ConversationList of a specified amount.
 *
 * @export
 * @param {number} length The number of dummyConversations
 * @return {ConversationList}
 */
export function dummyConversationList(length: number, type: LogType = LogType.Alexa): ConversationList {
    const logs = dummyLogs(length * 2);
    return ConversationList.fromLogs(logs);
}

/**
 * Returns a specified amount of dummy logs for unit testing
 *
 * @export
 * @param {number} length The number of logs
 * @returns {Log[]}
 */
export function dummyLogs(length: number, type: LogType = LogType.Alexa): Log[] {

    let logs: Log[] = [];

    const date: Date = new Date();

    for (let i = 0; i < length; i++) {
        let tag: string = "response";
        let transaction_id: string = "" + (i - 1);
        let payload: any = responsePayload(type);

        const dateCopy = new Date();
        dateCopy.setSeconds(date.getSeconds() - i);

        // if 0 or even, make it a request.
        if (i % 2 === 0) {
            tag = "request";
            transaction_id = "" + i;
            dateCopy.setSeconds(dateCopy.getSeconds() - 1);
            payload = requestPayload(i, type);
        }

        // create a new dummy log
        let log = new Log({
            payload: payload,
            log_type: "INFO",
            timestamp: dateCopy,
            source: "source",
            transaction_id: transaction_id,
            tags: [tag],
            id: "" + i
        });

        logs.push(log);
    }
    return logs;
}

/**
 * Returns a specified number of Output objects.
 *
 * @export
 * @param {number} length The number of Output objects.
 * @returns {Output[]}
 */
export function dummyOutputs(length: number): Output[] {
    let outputs: Output[] = [];

    let baseMessage: string = "TestOutput";
    let baseLevel: LOG_LEVELS = "DEBUG";
    let baseTimestamp: Date = new Date();
    let baseTransactionId: string = "TestTransactionID";
    let baseId: string = "TestID";

    for (let i = 0; i < length; i++) {
        outputs.push(new Output({
            message: baseMessage + i,
            level: baseLevel,
            timestamp: baseTimestamp,
            transaction_id: baseTransactionId + i,
            id: baseId + i
        }));
    }
    return outputs;
}

/**
 * Returns a specified amount of dummy sources for unit testing
 *
 * @export
 * @param {number} length
 * @returns {Source[]}
 */
export function dummySources(length: number): Source[] {
    let baseName: string = "Source Name";
    let baseSecret: string = "Super-Secret-Key";
    let baseMembers: any = [];
    let baseId: string = "Source-ID";
    let baseCreated: Date = new Date();

    let sources: Source[] = [];

    for (let i = 0; i < length; i++) {
        let source = new Source({
            name: baseName + i,
            secretKey: baseSecret + i,
            id: baseId + i,
            members: baseMembers,
            created: baseCreated
        });

        sources.push(source);
    }

    return sources;
}

export function alexaRequestLaunchIntentLog(): Log {
    return new Log({
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
    });
}

export function alexaRequestIntentLog(): Log {
    return new Log({
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
    });
}

export function alexaResponseLog(): Log {
    return new Log({
        payload: {
            "version": "1.0",
            "type": "INFO",
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
    });
}

export function alexaRequestPlayerLog(): Log {
    return new Log({
        payload: {
            "request": {
                "type": "LaunchRequest",
                "locale": "en-US",
                "requestId": "amzn1.echo-api.request.f9181e8c-0e69-484e-8332-83b5043fa83a",
                "timestamp": "2016-11-10T23:59:50Z"
            },
            "context": {
                "System": {
                    "application": {
                        "applicationId": "appId"
                    },
                    "user": {
                        "userId": "amzn1.ask.account.1237345d-bb6a-470a-b5fd-40dd148390a7"
                    }
                },
                "AudioPlayer": {
                    "playerActivity": "STOPPED",
                    "token": "0",
                    "offsetInMilliseconds": 0
                }
            },
            "version": "1.0",
            "session": {
                "sessionId": "SessionID.65b8bf17-a13e-4baa-b55c-6ca9127a6d76",
                "application": {
                    "applicationId": "JPK"
                },
                "new": true,
                "attributes": {
                    "STATE": "",
                    "index": 0,
                    "offsetInMilliseconds": 0,
                    "playbackFinished": false,
                    "playbackIndexChanged": true,
                    "enqueuedToken": false
                }
            }
        },
        log_type: "INFO",
        source: "source",
        transaction_id: "bf1e8de6-2d40-40d2-8392-0e47672eea64",
        timestamp: new Date("2016-11-10T23:59:50.111Z"),
        tags: [
            "request"
        ],
        id: "582509f77a0db10022c0886b"
    });
}

export function alexaResponsePlayerLog(): Log {
    return new Log({
        payload: {
            "version": "1.0",
            "response": {
                "shouldEndSession": false,
                "outputSpeech": {
                    "type": "SSML",
                    "ssml": "<speak> <audio src=\"https://s3.amazonaws.com/bespoken/streaming/bespokenspodcast-INTRODUCTION.mp3\" />You can say play, scan titles, or about the podcast </speak>"
                },
                "reprompt": {
                    "outputSpeech": {
                        "type": "SSML",
                        "ssml": "<speak> You can say play, scan titles, or about the podcast </speak>"
                    }
                }
            },
            "sessionAttributes": {
                "STATE": "",
                "index": 0,
                "offsetInMilliseconds": 0,
                "playbackFinished": false,
                "playbackIndexChanged": true,
                "enqueuedToken": false
            }
        },
        log_type: "INFO",
        source: "source",
        transaction_id: "bf1e8de6-2d40-40d2-8392-0e47672eea64",
        timestamp: new Date("2016-11-10T23:59:50.112Z"),
        tags: [
            "response"
        ],
        id: "582509f77a0db10022c0886c"
    });
}

export function googleHomeRequestLog(type: LOG_LEVELS = "INFO"): Log {
    return new Log({
        payload: {
            id: "a3912826-9a00-490b-b8ca-966c59d23a09",
            timestamp: "2017-02-06T22:46:04.295Z",
            result: {
                source: "agent",
                resolvedQuery: "GOOGLE_ASSISTANT_WELCOME",
                speech: "testSpeech",
                action: "assistant.intent.action.MAIN",
                actionIncomplete: false,
                contexts: [{
                    name: "google_assistant_welcome",
                    lifespan: 0
                }],
                metadata: {
                    intentId: "238068ce-0041-637c-a367-9ca71ab3c397",
                    webhookUsed: true,
                    webhookForSlotFillingUsed: false,
                    intentName: "Initial Intent assistant.intent.action.MAIN"
                },
                fullfillment: {
                    speech: "Test Speech",
                    messages: [{
                        type: 0,
                        speech: "Test Speech"
                    }]
                },
                score: 1
            },
            status: {
                code: 200,
                errorType: "success"
            },
            sessionId: "1486421163972",
            originalRequest: {
                source: "google",
                data: {
                    inputs: [{
                        arguments: [],
                        intent: "assistant.intent.action.MAIN",
                        raw_inputs: {
                            query: "Progressive",
                            input_type: 2
                        }
                    }],
                    user: {
                        user_id: "HhH6aw5nfy3E4CPHJwX5URGaDs6pUs4vtcCK2ys8CIc="
                    },
                    conversation: {
                        conversation_id: "1486421163972",
                        type: 1
                    }
                }
            }
        },
        log_type: type,
        source: "source",
        transaction_id: "bf1e8de6-2d40-40d2-8392-0e47672eea64",
        timestamp: new Date("2016-11-10T23:59:50.112Z"),
        tags: [
            "request"
        ],
        id: "582509f77a0db10022c0886c"
    });
}

export function googleHomeResponseLog(type: LOG_LEVELS = "INFO") {
    return new Log({
        payload: {
            speech: "<speak> <audio src=\"https://s3.amazonaws.com/xapp-files/Voice+Apps/Progressive/Progressive-Home_Page.mp3\" /> <break time=\"0.2s\"/> Which would you like to hear? </speak>",
            data: {
                google: {
                    expect_user_response: true,
                    is_ssml: true,
                    no_input_prompts: [{
                        ssml: "<speak> Would you like to hear tips about your car, or tips about your home? </speak>"
                    }]
                }
            },
            contextOut: [{
                name: "_actions_on_Google",
                lifespan: 100,
                parameters: {
                    LASTINTENT: {
                        name: "LaunchIntent",
                        utterances: [],
                        action: {
                            ask: {
                                text: "<speak> <audio src=\"https://s3.amazonaws.com/xapp-files/Voice+Apps/Progressive/Progressive-Home_Page.mp3\" /> <break time=\"0.2s\"/> Which would you like to hear? </speak>",
                                type: "TEXT"
                            },
                            reprompt: {
                                text: "<speak> Would you like to hear tips about your car, or tips about your home? </speak>",
                                type: "TEXT"
                            }
                        },
                        expectedIntents: [
                            "Homepage", "Help", "CarTips", "CarBuying", "InsuranceQuote", "UsedCarTip", "CarCareTips", "HomeTips", "CurbAppeal", "SmartHome", "Moving", "MoreChoices", "Repeat"
                        ]
                    },
                    LASTPROMPT: "<speak> <audio src=\"https://s3.amazonaws.com/xapp-files/Voice+Apps/Progressive/Progressive-Home_Page.mp3\" /> <break time=\"0.2s\"/> Which would you like to hear? </speak>"
                }
            }]
        },
        log_type: type,
        source: "source",
        transaction_id: "bf1e8de6-2d40-40d2-8392-0e47672eea64",
        timestamp: new Date("2016-11-10T23:59:50.112Z"),
        tags: [
            "response"
        ],
        id: "582509f77a0db10022c0886c"
    });
}

function requestPayload(index: number, logType: LogType) {
    switch (logType) {
        case LogType.Alexa:
        default:
            return alexaRequestPayload(index);
    }
}

function responsePayload(logType: LogType) {
    switch (logType) {
        case LogType.Alexa:
        default:
            return alexaResponsePayload();
    }
}

function alexaRequestPayload(index: number): any {
    return {
        version: "1.0",
        session: {
            new: true,
            sessionId: "amzn1.echo-api.session." + uuid.v4(),
            application: {
                applicationId: "amzn1.ask.skill.07dc249f-caf2-4fc0-bdbe-32b6702426ea"
            },
            user: {
                userId: "amzn1.ask.account.AFP3ZWPOS2BGJR7OWJZ3DHPKMOMBGMYLIYKQUSZHAIR7ALWSV5B2MPTYCUZWZBNUJ3GFOZP6NOCGKQCA73Z2CS4II6OO5NQDUH52YC7UFM2ADB4WTMB66R5UONMNIZMS3NRHCTQXEUPMOQDRH3XSBXZWMGGZDSQA7R7E4EPA4IHO7FP6ANM7NFX7U7RQQ37AWQDI334WGWDJ63A"
            }
        },
        context: {
            AudioPlayer: {
                playerActivity: "IDLE"
            },
            System: {
                application: {
                    applicationId: "amzn1.ask.skill.07dc249f-caf2-4fc0-bdbe-32b6702426ea"
                },
                user: {
                    userId: "amzn1.ask.account.AFP3ZWPOS2BGJR7OWJZ3DHPKMOMBGMYLIYKQUSZHAIR7ALWSV5B2MPTYCUZWZBNUJ3GFOZP6NOCGKQCA73Z2CS4II6OO5NQDUH52YC7UFM2ADB4WTMB66R5UONMNIZMS3NRHCTQXEUPMOQDRH3XSBXZWMGGZDSQA7R7E4EPA4IHO7FP6ANM7NFX7U7RQQ37AWQDI334WGWDJ63A"
                }
            }
        },
        request: {
            type: "IntentRequest.Main." + index,
            requestId: "amzn1.echo-api.request." + uuid.v4(),
            timestamp: "2016-11-03T21:22:53Z",
            locale: "en-US"
        }
    };
}

function alexaResponsePayload(): any {
    return {
        version: "1.0",
        type: "INFO",
        response: {
            outputSpeech: {
                type: "SSML",
                ssml: "<speak> Oh boy, what a demo </speak>"
            },
            shouldEndSession: true
        }
    };
}