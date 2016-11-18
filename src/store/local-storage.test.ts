import * as chai from "chai";

import * as storage from "./local-storage";

let expect = chai.expect;

describe("Tests methods in the local-storage file.", function () {

    describe("Tests the MemoryCache.", function () {
        let memoryCache: storage.MemoryCacheStorage;

        beforeEach(function() {
            memoryCache = new storage.MemoryCacheStorage();
        });

        it("Tests that \"length\" is 0 when empty.", function() {
            expect(memoryCache.length).to.equal(0);
        });

        it("Tests \"setItem\", \"getItem\", and \"length\".", function () {
            memoryCache.setItem("key1", "value1");

            expect(memoryCache.length).to.equal(1);
            expect(memoryCache.getItem("key1")).to.equal("value1");
        });

        it("Tests \"getItem\" returns null with invalid key.", function() {
            expect(memoryCache.getItem("NoKey")).to.be.null;
        });

        it ("Tests \"key\" returns a good item.", function() {
            for (let i = 0; i < 5; i++) {
                memoryCache.setItem("key" + i, "value" + i);
            }

            for (let i = 0; i < 5; i++) {
                expect(memoryCache.key(i)).to.equal("value" + i);
            }
        });

        it("Tests \"key\" returns a null with invalid key.", function() {
            expect(memoryCache.key(1)).to.be.null;
        });

        it("Tests \"remove\" item successfully removes said item.", function() {
            memoryCache.setItem("key1", "value1");
            memoryCache.removeItem("key1");
            expect(memoryCache.getItem("key1")).to.be.null;
        });

        it ("Tests \"clear\"", function() {
            for (let i = 0; i < 5; i++) {
                memoryCache.setItem("key" + i, "value" + i);
            }

            memoryCache.clear();

            for (let i = 0; i < 5; i++) {
                expect(memoryCache.getItem("key" + i)).to.be.null;
            }
        });
    });
});