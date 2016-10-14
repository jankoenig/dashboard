import  User  from "./user";
import { expect } from "chai";

describe("User", function() {
  describe("default constructor", function() {
    it("should set the email and token", function() {
      let user = new User({email : "my@email.com", token: "abc123"});
      expect(user.email).to.eq("my@email.com");
      expect(user.token).to.eq("abc123");
    });
  });
  it("can serialize", function() {
    let user = new User({email: "my@email.com", token: "abc123"});
    let json = JSON.stringify(user);
    expect(json).to.eq("{\"email\":\"my@email.com\",\"token\":\"abc123\"}");
  });
  it ("can deserialize", function() {
    let user = new User({email: "my@email.com", token: "abc123"});
    let json = JSON.stringify(user);
    let deserializedUser = new User(JSON.parse(json));
    expect(deserializedUser.email).to.equal(user.email);
    expect(deserializedUser.token).to.equal(user.token);
  });
});
