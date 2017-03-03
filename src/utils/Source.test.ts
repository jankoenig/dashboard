import * as chai from "chai";

import Source from "../models/source";
import SourceUtil from "./Source";

const expect = chai.expect;

describe("SourceUtils", function() {

    describe("Source Equals function", function() {
        let s1: Source;
        let s2: Source;
        let s3: Source;

        before(function() {
            s1 = new Source({
                name: "Source1",
                id: "ABC123"
            });
            s2 = new Source({
                name: "Source2",
                id: "123ABC"
            });
            s3 = {...s1};
        });

        it("Tests two of the same references are true.", function() {
            expect(SourceUtil.equals(s1, s1)).to.be.true;
        });

        it("Tests two of different id are false.", function() {
            expect(SourceUtil.equals(s1, s2)).to.be.false;
        });

        it("Tests two of the same ID are true.", function() {
            expect(SourceUtil.equals(s1, s3)).to.be.true;
        });

        it("Tests two undefined are true.", function() {
            expect(SourceUtil.equals(undefined, undefined)).to.be.true;
        });

        it ("Tests first undefeined is false.", function() {
            expect(SourceUtil.equals(undefined, s1)).to.be.false;
        });

        it ("Tests Second undefined is false.", function() {
            expect(SourceUtil.equals(s1, undefined)).to.be.false;
        });
    });
});