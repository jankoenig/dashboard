import { expect } from "chai";
import * as sinon from "sinon";

import Interval from "./Interval";

describe("Interval", function () {
    let clock: sinon.SinonFakeTimers;
    let callback: sinon.SinonStub;

    let interval: Interval.Executor;

    before(function() {
        clock = sinon.useFakeTimers();
        clock.setInterval = sinon.spy(clock.setInterval);
        clock.clearInterval = sinon.spy(clock.clearInterval);
        callback = sinon.stub();
    });

    beforeEach(function() {
        interval = Interval.newExecutor(1000, callback);
    });

    afterEach(function() {
        clock.reset();
        (clock.setInterval as sinon.SinonSpy).reset();
        (clock.clearInterval as sinon.SinonSpy).reset();
        callback.reset();
    });

    after(function() {
        clock.restore();
    });

    it("Starts the timer on start().", function() {
        interval.start();

        expect(clock.setInterval).to.be.calledOnce;
        expect(clock.setInterval).to.be.calledWith(callback, 1000);
    });

    it("Ends the timer on end().", function() {
        interval.start();
        interval.end();

        expect(clock.clearInterval).to.be.calledOnce;
        expect(clock.clearInterval).to.be.calledWith((clock.setInterval as sinon.SinonSpy).returnValues[0]);
    });

    it("Does nothing if you call end before calling start.", function() {
        interval.end();

        expect(clock.setInterval).to.not.be.called;
        expect(clock.clearInterval).to.not.be.called;
    });
});