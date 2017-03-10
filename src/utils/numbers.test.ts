import { expect } from "chai";

import Numbers from "./numbers";

describe("Numbers", function() {
    describe("max", function() {
        it("returns the max of three numbers", function() {
            expect(Numbers.max(0, 1, 2)).to.equal(2);
            expect(Numbers.max(1, 1, 1)).to.equal(1);
            expect(Numbers.max(1, -1, 0)).to.equal(1);
        });
    });
    describe("min", function() {
        it("returns the min of three numbers", function() {
            expect(Numbers.min(0, 1, 2)).to.equal(0);
            expect(Numbers.min(1, 1, 1)).to.equal(1);
            expect(Numbers.min(1, -1, 0)).to.equal(-1);
        });
    });
    describe("round", function() {
        it("rounds to the provided precision", function() {
            expect(Numbers.round(55.555, 1)).to.equal(55.6);
            expect(Numbers.round(55.555555, 5)).to.equal(55.55556);
            expect(Numbers.round(0.55, 2)).to.equal(0.55);
            expect(Numbers.round(0.5, 0)).to.equal(1);
        });
    });
    describe("hash", function() {
        let hashable = "this will be hashed";
        let hashableAlso = "this will be hashed";
        let hash = Numbers.hashCode(hashable);
        let hashAlso = Numbers.hashCode(hashableAlso);
        it("converts a string to a number", function() {
            expect(hash).to.be.a("number");
        });
        it("returns the same hash for two similar strings", function() {
            expect(hash).to.equal(hashAlso);
        });
    });
});