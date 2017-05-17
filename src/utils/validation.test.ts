import * as chai from "chai";

import {propertyExist} from "./validation";

let expect = chai.expect;
const testObject = {prop1: { prop2: {prop3: "test value"}}};
const testObjectArray = {prop1: { prop2: [{prop3: "test value"}]}};

describe("validation", function () {
  describe("check if property exist", function() {
    it("returns true if property exist", function() {
      expect(propertyExist(testObject, "prop1", "prop2", "prop3")).to.equal(true);
    });
    it("returns false if property doesn't exist", function() {
      expect(propertyExist(testObject, "prop1", "prop2", "prop4")).to.equal(false);
    });
    it("returns false if property doesn't exist on right level", function() {
      expect(propertyExist(testObject, "prop1", "prop3", "prop2")).to.equal(false);
    });
    it("returns false if used with arrays", function() {
      expect(propertyExist(testObjectArray, "prop1", "prop2", "prop3")).to.equal(false);
    });
  });
});
