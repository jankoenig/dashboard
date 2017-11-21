import { expect } from "chai";

import User, { FirebaseUser } from "./user";

describe("User", function () {
  describe("constructor", function () {
    it("should set the email and token", function () {
      let user = new User({ email: "my@email.com", displayName: "", photoURL: "" });
      expect(user.email).to.eq("my@email.com");
    });
  });
  it("can serialize", function () {
    let user = new User({ email: "my@email.com", displayName: "", photoURL: "" });
    let json = JSON.stringify(user);
    expect(json).to.eq("{\"email\":\"my@email.com\"\,\"displayName\":\"\"\,\"photoURL\":\"\"}");
  });
  it("can deserialize", function () {
    let user = new User({ email: "my@email.com", displayName: "", photoURL: "" });
    let json = JSON.stringify(user);
    let deserializedUser = new User(JSON.parse(json));
    expect(deserializedUser.email).to.equal(user.email);
  });
  describe("Firebase User", function () {
    it("can be created from a Firebase.User", function () {
      let user = new FirebaseUser({ email: "my@email.com", displayName: "displayName", photoURL: "photoUrl", providerId: "providerId", uid: "uid" });

      expect(user.email).to.equal("my@email.com");
      expect(user.displayName).to.equal("displayName");
      expect(user.photoURL).to.equal("photoUrl");
    });
  });
});
