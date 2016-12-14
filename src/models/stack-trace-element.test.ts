import { expect } from "chai";

import StackTraceElement from "./stack-trace-element";

describe("StackTraceElement", function() {
    describe("constructor", function() {
        it("sets the properties", function() {
            let stackTraceElement = new StackTraceElement({
                line: 34,
                file: "file.java",
                class: "class",
                method: "someMethod"
            });

            expect(stackTraceElement.line).to.equal(34);
            expect(stackTraceElement.file).to.equal("file.java");
            expect(stackTraceElement.class).to.equal("class");
            expect(stackTraceElement.method).to.equal("someMethod");
        });
    });
    describe("fromString", function() {
        describe("with Java stacktrace", function() {
            let stackTraceElement = "tools.bespoken.sample.HelloWorldSpeechlet.onLaunch(HelloWorldSpeechlet.java:47)";
            let ste = StackTraceElement.fromString(stackTraceElement);
            it("sets the line number", function() {
                expect(ste.line).to.equal(47);
            });
            it("sets the class name", function() {
                expect(ste.class).to.equal("HelloWorldSpeechlet");
            });
            it("sets the file name", function() {
                expect(ste.file).to.equal("HelloWorldSpeechlet.java");
            });
            it("sets the method name", function() {
                expect(ste.method).to.equal("onLaunch");
            });
        });
    });
});