import { expect } from "chai";

import { changeForm } from "../actions/auth-form";
import { authForm } from "./auth-form";

describe("Auth Form Reducer", function() {
    it("returns the initial state", function() {
        let newState = authForm(undefined, {type: ""});
        expect(newState.email).to.equal("");
        expect(newState.password).to.equal("");
        expect(newState.error).to.be.undefined;
    });
    describe("change form action", function() {
        it("sets the field and value", function() {
            let newState = authForm({}, changeForm("email", "my@email.com"));
            expect(newState.email).to.equal("my@email.com");
        });
    });
});