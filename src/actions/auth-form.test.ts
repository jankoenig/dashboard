import * as chai from "chai";

import * as authForm from "./auth-form";

let expect = chai.expect;

describe("AuthForm actions", function() {
    it("sets the fields", function() {
        let action = authForm.changeForm("name", "bob");
        expect(action.field).to.equal("name");
        expect(action.value).to.equal("bob");
    });
});