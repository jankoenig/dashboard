import { expect } from "chai";
import { falseBoolNoop } from "./Noop";

describe("Noop", function () {
    describe("falseBoolNoop", function() {
        it("returns false", function() {
            expect(falseBoolNoop()).to.be.false;
        });
    });
});