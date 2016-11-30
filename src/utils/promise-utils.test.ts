import { expect } from "chai";

import * as Utils from "./promise-utils";

describe("Promise Utils", function() {
    describe("filter", function() {
        it ("Verifies all items are iterated through", function() {
            let caughtIndexes: number[] = [];
            return Utils.filter([1, 2, 3, 4, 5, 6], function (item: number, index: number): boolean {
                caughtIndexes.push(index);
                return item < 3;
            }).then(function(filteredItems: number[]) {
                expect(caughtIndexes.length).to.equal(6);
                for (let i = 0; i < caughtIndexes.length; ++i) {
                    expect(caughtIndexes[i]).to.equal(i);
                }
            });
        });

        it("Tests if filters the series of numbers", function() {
            return Utils.filter([1, 2, 3, 4, 5, 6], function (item: number, index: number): boolean {
                return item < 3;
            }).then(function(filteredItems: number[]) {
                expect(filteredItems.length).to.equal(2);
                expect(filteredItems[0]).to.equal(1);
                expect(filteredItems[1]).to.equal(2);
            });
        });

        it ("Tests an error is thrown if no items were found.", function() {
            return Utils.filter([1, 2, 3, 4, 5, 6], function (item: number, index: number): boolean {
                return item > 7;
            }).catch(function(err: Error) {
                expect(err).to.not.be.undefined;
            });
        });

        it ("Tests the items are returned if the filter was undefined.", function() {
            return Utils.filter([1,2,3,4,5,6], undefined)
                    .then(function(items: number[]) {
                        expect(items.length).to.equal(6);
                        expect(items[0]).to.equal(1);
                        expect(items[1]).to.equal(2);
                        expect(items[2]).to.equal(3);
                        expect(items[3]).to.equal(4);
                        expect(items[4]).to.equal(5);
                        expect(items[5]).to.equal(6);
                    });
        })
    });
});