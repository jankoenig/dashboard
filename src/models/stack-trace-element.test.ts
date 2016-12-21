import { expect } from "chai";
let fs = require("fs");
let path = require("path");

const javaStackTrace = fs.readFileSync(path.resolve(__dirname, "../assets/test/example-java-stack-trace.txt"), "utf8");
const jsStackTrace = fs.readFileSync(path.resolve(__dirname, "../assets/test/example-javascript-stack-trace.txt"), "utf8");

import StackTraceElement, { javaScriptStackTraceRegex, javaStackTraceRegex } from "./stack-trace-element";

describe("StackTraceElement", function () {
    describe("constructor", function () {
        it("sets the properties", function () {
            let stackTraceElement = new StackTraceElement({
                raw: "raw",
                line: 34,
                file: "file.java",
                class: "class",
                method: "someMethod"
            });

            expect(stackTraceElement.raw).to.equal("raw");
            expect(stackTraceElement.line).to.equal(34);
            expect(stackTraceElement.file).to.equal("file.java");
            expect(stackTraceElement.class).to.equal("class");
            expect(stackTraceElement.method).to.equal("someMethod");
        });
    });
    describe("fromString", function () {
        describe("with Java stacktrace", function () {
            let stackTraceElement = "tools.bespoken.sample.HelloWorldSpeechlet.onLaunch(HelloWorldSpeechlet.java:47)";
            let ste = StackTraceElement.fromString(stackTraceElement);
            it("sets the raw string", function() {
                expect(ste.raw).to.equal(stackTraceElement);
            });
            it("sets the line number", function () {
                expect(ste.line).to.equal(47);
            });
            it("sets the class name", function () {
                expect(ste.class).to.equal("HelloWorldSpeechlet");
            });
            it("sets the file name", function () {
                expect(ste.file).to.equal("HelloWorldSpeechlet.java");
            });
            it("sets the method name", function () {
                expect(ste.method).to.equal("onLaunch");
            });
        });
        describe("with JavaScript stack trace with class", function () {
            let stackTraceElement = "    at Request.self.callback (/Users/michaelmyers/Development/travis-ci-skill/src/node_modules/travis-ci/node_modules/request/request.js:187:22)";
            let ste = StackTraceElement.fromString(stackTraceElement);
            it("sets the raw string", function() {
                expect(ste.raw).to.equal(stackTraceElement);
            });
            it("sets the line number", function () {
                expect(ste.line).to.equal(187);
            });
            it("sets the file name", function () {
                expect(ste.file).to.equal("request.js");
            });
        });
        describe("with JavaScript stack trace without file path", function() {
            let stackTraceElement = "    at Request.emit (events.js:172:7)";
            let ste = StackTraceElement.fromString(stackTraceElement);
            it("sets the raw string", function() {
                expect(ste.raw).to.equal(stackTraceElement);
            });
            it("sets the line number", function () {
                expect(ste.line).to.equal(172);
            });
            it("sets the file name", function () {
                expect(ste.file).to.equal("events.js");
            });
        });
    });
    describe("javaStackTraceRegex", function () {
        it("recognizes a Java stack trace", function () {
            expect(javaStackTraceRegex.exec(javaStackTrace)).to.not.be.null;
        });
    });
    describe("javaScriptStackTraceRegex", function() {
        it("recognizes a JavaScript stack trace", function() {
            expect(javaScriptStackTraceRegex.exec(jsStackTrace)).to.not.be.null;
        });
    });
});
