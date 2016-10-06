/// <reference path="../../typings/globals/chai/index.d.ts" />
/// <reference path="../../typings/globals/mocha/index.d.ts" />

import { User } from "./user";
import { expect } from "chai";

describe("User", function() {
  describe("constructor", function() {
    it("should set the email", function() {
      let user = new User({email : "my@email.com"});
      expect(user.email).to.eq("my@email.com");
    });
  });
});
