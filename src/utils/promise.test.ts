import { expect } from "chai";

import * as Utils from "./promise";

describe("Promise Utils", function () {
    describe("filter", function () {
        it("Verifies all items are iterated through", function () {
            let caughtIndexes: number[] = [];
            return Utils.filter([1, 2, 3, 4, 5, 6], function (item: number, index: number): boolean {
                caughtIndexes.push(index);
                return item < 3;
            }).then(function (result: Utils.FilterResult<number>) {
                expect(caughtIndexes.length).to.equal(6);
                for (let i = 0; i < caughtIndexes.length; ++i) {
                    expect(caughtIndexes[i]).to.equal(i);
                }
            });
        });

        it("Tests if filters the series of numbers", function () {
            return Utils.filter([1, 2, 3, 4, 5, 6], function (item: number, index: number): boolean {
                return item < 3;
            }).then(function (result: Utils.FilterResult<number>) {
                expect(result.result.length).to.equal(2);
                expect(result.result[0]).to.equal(1);
                expect(result.result[1]).to.equal(2);
                expect(result.changed).to.be.true;
            });
        });

        it("Tests if filters the series of numbers when nothing gets filtered", function () {
            return Utils.filter([1, 2, 3, 4, 5, 6], function (item: number, index: number): boolean {
                return true;
            }).then(function (result: Utils.FilterResult<number>) {
                expect(result.result.length).to.equal(6);
                expect(result.result[0]).to.equal(1);
                expect(result.result[1]).to.equal(2);
                expect(result.result[2]).to.equal(3);
                expect(result.result[3]).to.equal(4);
                expect(result.result[4]).to.equal(5);
                expect(result.result[5]).to.equal(6);
                expect(result.changed).to.be.false;
            });
        });

        it("Tests condition if no items were found.", function () {
            return Utils.filter([1, 2, 3, 4, 5, 6], function (item: number, index: number): boolean {
                return false;
            }).then(function (result: Utils.FilterResult<number>) {
                expect(result.result.length).to.equal(0);
                expect(result.changed).to.be.true;
            });
        });

        it("Tests the items are returned if the filter was undefined.", function () {
            return Utils.filter([1, 2, 3, 4, 5, 6], undefined)
                .then(function (result: Utils.FilterResult<number>) {
                    expect(result.result.length).to.equal(6);
                    expect(result.result[0]).to.equal(1);
                    expect(result.result[1]).to.equal(2);
                    expect(result.result[2]).to.equal(3);
                    expect(result.result[3]).to.equal(4);
                    expect(result.result[4]).to.equal(5);
                    expect(result.result[5]).to.equal(6);
                    expect(result.changed).to.be.false;
                });
        });
    });
});