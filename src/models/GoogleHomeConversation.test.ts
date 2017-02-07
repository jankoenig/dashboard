import { expect } from "chai";

import { googleHomeRequestLog, googleHomeResponseLog } from "../utils/test";
import Conversation, { createConvo } from "./conversation";
import Log from "./log";
import Output from "./output";

describe("Google Conversation", function () {
    describe("Construction", function () {
        let response: Log;
        let request: Log;
        let output: Output;
        let outputs: Output[];
        let conversation: Conversation;

        before(function () {
            request = googleHomeRequestLog();
            response = googleHomeResponseLog();
            output = new Output({
                message: "message",
                level: "DEBUG",
                timestamp: new Date(),
                transaction_id: "transaction_id",
                id: "id"
            });
            outputs = [output];
            conversation = createConvo({ request: request, response: response, outputs: outputs });
        });

        it("tests that all basic properties were set.", function () {
            expect(conversation).to.exist;
            expect(conversation.request).to.exist;
            expect(conversation.response).to.exist;
            expect(conversation.outputs).to.have.length(outputs.length);
        });

        it("Tests the session ID", function () {
            expect(conversation.sessionId).to.equal("1486421163972");
        });

        it("Tests the user ID", function () {
            expect(conversation.userId).to.equal("HhH6aw5nfy3E4CPHJwX5URGaDs6pUs4vtcCK2ys8CIc=");
        });

        it("Tests the request payload type", function () {
            expect(conversation.requestPayloadType).to.equal("assistant.intent.action.MAIN");
        });

        it("Tests the intent", function () {
            expect(conversation.intent).to.equal("assistant.intent.action.MAIN");
        });

        it("Tests the timestamp", function () {
            expect(conversation.timestamp).to.equal(request.timestamp);
        });

        it("Tests the output", function () {
            expect(conversation.outputs[0]).to.equal(output);
        });

        it("Tests the has error", function () {
            expect(conversation.hasError).to.be.false;
        });
    });

    describe("hasError", function () {
        it("returns true when an error output exists", function () {
            let request = googleHomeRequestLog();
            let response = googleHomeResponseLog();
            let output = new Output({
                message: "message",
                level: "ERROR",
                timestamp: new Date(),
                transaction_id: "transaction_id",
                id: "id"
            });
            let outputs = [output];

            let conversation = createConvo({ response: response, request: request, outputs: outputs });
            expect(conversation.hasError).to.be.true;
        });

        it("Returns true when an error log exists for request.", function () {
            let request = googleHomeRequestLog("ERROR");
            let response = googleHomeResponseLog();

            let conversation = createConvo({ response: response, request: request });
            expect(conversation.hasError).to.be.true;
        });

        it("Returns true when an error log exists for request.", function () {
            let request = googleHomeRequestLog();
            let response = googleHomeResponseLog("ERROR");

            let conversation = createConvo({ response: response, request: request });
            expect(conversation.hasError).to.be.true;
        });
    });

    describe("userColors", function () {
        it("returns default colors for an undefined userId", function () {

            let request = new Log({
                payload: {},
                log_type: "DEBUG",
                source: "source",
                transaction_id: "transaction_id",
                timestamp: new Date(),
                tags: [],
                id: ""
            });
            let response = googleHomeRequestLog();
            let output = new Output({
                message: "message",
                level: "DEBUG",
                timestamp: new Date(),
                transaction_id: "transaction_id",
                id: "id"
            });
            let outputs = [output];

            let conversation = createConvo({ response: response, request: request, outputs: outputs });

            expect(conversation.userColors.fill).to.equal("#ffffff");
            expect(conversation.userColors.background).to.equal("#000000");
        });

        it("returns the default colors for an empty string userId", function () {
            let request = new Log({
                payload: {
                    originalRequest: {
                        data: {
                            user: {
                                user_id: ""
                            },
                        }
                    }
                },
                log_type: "DEBUG",
                source: "source",
                transaction_id: "transaction_id",
                timestamp: new Date(),
                tags: [],
                id: ""
            });
            let response = googleHomeRequestLog();
            let output = new Output({
                message: "message",
                level: "DEBUG",
                timestamp: new Date(),
                transaction_id: "transaction_id",
                id: "id"
            });
            let outputs = [output];

            let conversation = createConvo({ response: response, request: request, outputs: outputs });

            expect(conversation.userColors.fill).to.equal("#ffffff");
            expect(conversation.userColors.background).to.equal("#000000");
        });

        it("returns the hex color for a hex userId", function () {
            let request = new Log({
                payload: {
                    originalRequest: {
                        data: {
                            user: {
                                user_id: "A234b6"
                            },
                        }
                    }
                },
                log_type: "DEBUG",
                source: "source",
                transaction_id: "transaction_id",
                timestamp: new Date(),
                tags: [],
                id: ""
            });
            let response = googleHomeRequestLog();
            let output = new Output({
                message: "message",
                level: "DEBUG",
                timestamp: new Date(),
                transaction_id: "transaction_id",
                id: "id"
            });
            let outputs = [output];

            let conversation = createConvo({ response: response, request: request, outputs: outputs });

            expect(conversation.userColors.fill).to.equal("#A234b6");
            expect(conversation.userColors.background).to.equal("#48b634");
        });

        it("returns the hex value for a base 36 userId", function () {
            let request = new Log({
                payload: {
                    originalRequest: {
                        data: {
                            user: {
                                user_id: "ZZZZZZ"
                            },
                        }
                    }
                },
                log_type: "DEBUG",
                source: "source",
                transaction_id: "transaction_id",
                timestamp: new Date(),
                tags: [],
                id: ""
            });
            let response = googleHomeRequestLog();
            let output = new Output({
                message: "message",
                level: "DEBUG",
                timestamp: new Date(),
                transaction_id: "transaction_id",
                id: "id"
            });
            let outputs = [output];

            let conversation = createConvo({ response: response, request: request, outputs: outputs });

            expect(conversation.userColors.fill).to.equal("#bf0fff");
            expect(conversation.userColors.background).to.equal("#4fff0f");
        });

        it("returns undefined if the request payload does not exist.", function () {
            let request = new Log({
                payload: "Generic string",
                log_type: "DEBUG",
                source: "source",
                transaction_id: "transaction_id",
                timestamp: new Date(),
                tags: [],
                id: ""
            });
            let response = googleHomeRequestLog();
            let output = new Output({
                message: "message",
                level: "DEBUG",
                timestamp: new Date(),
                transaction_id: "transaction_id",
                id: "id"
            });
            let outputs = [output];

            let conversation = createConvo({ response: response, request: request, outputs: outputs });
            expect(conversation.requestPayloadType).to.be.undefined;
        });
    });

    describe("without a request", function () {
        let response = googleHomeRequestLog();
        let request = undefined;
        let output = new Output({
            message: "message",
            level: "DEBUG",
            timestamp: new Date(),
            transaction_id: "transaction_id",
            id: "id"
        });
        let outputs = [output];

        let conversation = createConvo({ response: response, request: request, outputs: outputs });

        it("returns the id from the response", function () {
            expect(conversation.id).to.equal(response.id);
        });

        it("returns the timestamp from the response", function () {
            expect(conversation.timestamp).to.equal(response.timestamp);
        });
    });
});