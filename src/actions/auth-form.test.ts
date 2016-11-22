import * as chai from "chai";

import { AUTH_FORM_CHANGED, AUTH_FORM_ERROR } from "../constants";
import * as authForm from "./auth-form";

let expect = chai.expect;

describe("AuthForm action", function () {
    describe("form changed", function () {
        it("sets the fields", function () {
            let action = authForm.authFormChanged("name", "bob");
            expect(action.field).to.equal("name");
            expect(action.value).to.equal("bob");
            expect(action.type).to.equal(AUTH_FORM_CHANGED);
        });
    });
    describe("changeErrorInForm", function () {
        it("sets the value", function () {
            let action = authForm.authFormError("error");
            expect(action.type).to.equal(AUTH_FORM_ERROR);
            expect(action.error).to.equal("error");
        });
    });
});