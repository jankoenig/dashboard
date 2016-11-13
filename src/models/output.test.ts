import { expect } from "chai";

import Log from "./log";
import Output from "./output";

describe("Output", function () {
    it("sets the properties", function () {
        let output = new Output({
            message: "message",
            level: "DEBUG",
            timestamp: new Date(),
            transaction_id: "transaction_id",
            id: "id"
        });

        expect(output.message).to.equal("message");
        expect(output.level).to.equal("DEBUG");
        expect(output.timestamp).to.exist;
        expect(output.transaction_id).to.equal("transaction_id");
        expect(output.id).to.equal("id");
    });
    describe("fromLog", function() {
        let log = new Log({
            payload: "payload",
            log_type: "DEBUG",
            source: "source",
            transaction_id: "transaction_id",
            timestamp: new Date(),
            tags: [],
            id: "id"
        });

        let output = Output.fromLog(log);

        expect(output.message).to.equal("payload");
        expect(output.level).to.equal("DEBUG");
        expect(output.id).to.equal("id");
        expect(output.transaction_id).to.equal("transaction_id");
        expect(output.timestamp).to.equal(log.timestamp);
    });
    describe("levelColor", function () {
        it("returns the proper red for error", function () {
            let output = new Output({
                message: "message",
                level: "ERROR",
                timestamp: new Date(),
                transaction_id: "transaction_id",
                id: "id"
            });
            expect(output.levelColor).to.equal("red");
        });
        it("returns the proper orange for warn", function () {
            let output = new Output({
                message: "message",
                level: "WARN",
                timestamp: new Date(),
                transaction_id: "transaction_id",
                id: "id"
            });
            expect(output.levelColor).to.equal("orange");
        });
        it("returns the proper yellow for info", function () {
            let output = new Output({
                message: "message",
                level: "INFO",
                timestamp: new Date(),
                transaction_id: "transaction_id",
                id: "id"
            });
            expect(output.levelColor).to.equal("yellow");
        });
        it("returns the proper green for debug", function () {
            let output = new Output({
                message: "message",
                level: "DEBUG",
                timestamp: new Date(),
                transaction_id: "transaction_id",
                id: "id"
            });
            expect(output.levelColor).to.equal("rgb(166, 226, 46)");
        });
    });
});