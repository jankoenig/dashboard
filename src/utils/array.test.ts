import {expect} from "chai";

import ArraytUtils from "./array";

describe("array utils", function () {

  let data: any = [{sort: "test"}, {sort: "a test"}, {sort: "Z test"}];

  describe("sort array", function () {
    it("returns the array sorted by property", function () {
      const result = ArraytUtils.sortArrayByProperty(data, "sort");
      expect(result).to.deep.equal([{sort: "a test"}, {sort: "test"}, {sort: "Z test"}]);
    });
  });
});
