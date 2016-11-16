import { expect } from "chai";

import { changeErrorInForm, changeForm } from "../actions/auth-form";
import { authForm } from "./auth-form";

describe("Auth Form Reducer", function() {
    it("returns the initial state", function() {
        let newState = authForm(undefined, {type: ""});
        expect(newState.email).to.equal("");
        expect(newState.password).to.equal("");
        expect(newState.error).to.equal("");
        expect(newState.confirmPassword).to.equal("");
    });
    describe("change form action", function() {
        it("sets the field and value", function() {
            let newState = authForm({}, changeForm("email", "my@email.com"));
            expect(newState.email).to.equal("my@email.com");
        });
    });
    describe("auth error", function() {
        it("sets the error", function() {
            let newState = authForm(undefined, changeErrorInForm("error"));
            expect(newState.error).to.equal("error");
        });
    });
});