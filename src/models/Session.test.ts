import { expect } from "chai";

import Session from "./Session";

describe("Session", function () {
    let started = new Date();
    let playbackStarted = { timestamp: started };
    // add 5 seconds to the playbackStarted timestamp.

    let stopped = new Date(started);
    stopped.setSeconds(stopped.getSeconds() + 5);
    let playbackStopped = { timestamp: stopped };

    let session = new Session({
        start: playbackStarted,
        end: playbackStopped
    });
    describe("constructor", function () {
        it("sets the start property", function () {
            expect(session.start).to.equal(playbackStarted);
        });
        it("sets the end property", function () {
            expect(session.end).to.equal(playbackStopped);
        });
    });
    describe("duration", function () {
        it("returns the difference in seconds", function () {
            expect(session.duration).to.equal(5);
        });
    });
});