import Log from "../models/log";
import Source from "../models/source";

/**
 * Returns a specified amount of dummy logs for unit testing
 *
 * @export
 * @param {number} length The number of logs
 * @returns {Log[]}
 */
export function dummyLogs(length: number): Log[] {

    let logs: Log[] = [];

    for (let i = 0; i < length; i++) {

        let tag: string = "response";
        let transaction_id: string = "" + (i - 1);

        // if 0 or even
        if (i === 0 || !(i & 1)) {
            tag = "request";
            transaction_id = "" + i;
        }

        // create a new dummy log
        let log = new Log({
            payload: "payload",
            log_type: "INFO",
            timestamp: new Date(),
            source: "source",
            transaction_id: transaction_id,
            tags: [tag],
            id: "" + i
        });

        logs.push(log);
    }
    return logs;
}

export const requestLaunchIntentLog: Log = new Log({
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

export const requestIntentLog: Log = new Log({
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

export const responseLog: Log = new Log({
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
});

/**
 * Returns a specified amount of dummy sources for unit testing
 *
 * @export
 * @param {number} length
 * @returns {Source[]}
 */
export function dummySources(length: number): Source[] {

    let sources: Source[] = [];

    for (let i = 0; i < length; i++) {
        let source = new Source({ name: "Source Name"});

        sources.push(source);
    }

    return sources;
}