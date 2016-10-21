import  User  from "./user";
import { expect } from "chai";

describe("User", function() {
  describe("constructor", function() {
    it("should set the email and token", function() {
      let user = new User({email : "my@email.com"});
      expect(user.email).to.eq("my@email.com");
    });
  });
  it("can serialize", function() {
    let user = new User({email: "my@email.com"});
    let json = JSON.stringify(user);
    expect(json).to.eq("{\"email\":\"my@email.com\"}");
  });
  it ("can deserialize", function() {
    let user = new User({email: "my@email.com"});
    let json = JSON.stringify(user);
    let deserializedUser = new User(JSON.parse(json));
    expect(deserializedUser.email).to.equal(user.email);
  });
});
