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
    });
});