import { expect } from "chai";
let fs = require("fs");
let path = require("path");

const javaStackTrace = fs.readFileSync(path.resolve(__dirname, "../assets/test/example-java-stack-trace.txt"), "utf8");
const jsStackTrace = fs.readFileSync(path.resolve(__dirname, "../assets/test/example-javascript-stack-trace.txt"), "utf8");

import Log from "./log";
import StackTrace from "./stack-trace";

describe("StackTrace", function () {
    describe("constructor", function () {
        it("sets the properties", function () {
            let stackTrace = new StackTrace({
                timestamp: new Date(),
                raw: "raw",
                message: "message",
                elements: []
            });

            expect(stackTrace.timestamp).to.be.not.be.undefined;
            expect(stackTrace.raw).to.equal("raw");
            expect(stackTrace.message).to.equal("message");
            expect(stackTrace.elements).to.have.length(0);
        });
    });
    describe("fromLog", function () {
        describe("with Java Stack Trace", function () {
            let log = new Log({
                stack: javaStackTrace,
                timestamp: new Date(),
                payload: "Crash Message",
                log_type: "ERROR",
                source: "source",
                transaction_id: "transaction_id",
                tags: [],
                id: "id"
            });

            let stackTrace = StackTrace.fromLog(log);

            it("parses the payload", function () {
                expect(stackTrace.message).to.equal("Crash Message");
            });
            it("parses sets the raw string", function () {
                expect(stackTrace.raw).to.equal(javaStackTrace);
            });
            it("parses the elements", function () {
                expect(stackTrace.elements).to.have.length(23);
            });
            it("parses the correct top element", function () {
                let top = stackTrace.top;
                expect(top.line).to.equal(47);
                expect(top.class).to.equal("HelloWorldSpeechlet");
            });
        });
        describe("with JavaScript StackTrace", function () {
            let log = new Log({
                stack: jsStackTrace,
                timestamp: new Date(),
                payload: "ReferenceError: opinion is not defined",
                log_type: "ERROR",
                source: "source",
                transaction_id: "transaction_id",
                tags: [],
                id: "id"
            });

            let stackTrace = StackTrace.fromLog(log);

            it("parses the message", function () {
                expect(stackTrace.message).to.equal("ReferenceError: opinion is not defined");
            });
            it("parses sets the raw string", function () {
                expect(stackTrace.raw).to.equal(jsStackTrace);
            });
            it("parses the elements", function () {
                expect(stackTrace.elements).to.have.length(10);
            });
            it("parses the correct top element", function () {
                let top = stackTrace.top;
                expect(top.line).to.equal(52);
                expect(top.file).to.equal("index.js");
            });
        });
    });
});