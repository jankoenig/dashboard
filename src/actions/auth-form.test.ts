import * as chai from "chai";


import { AUTH_ERROR, CHANGE_FORM } from "../constants";
import * as authForm from "./auth-form";

let expect = chai.expect;

describe("AuthForm action", function () {
    describe("changeForm", function () {
        it("sets the fields", function () {
            let action = authForm.changeForm("name", "bob");
            expect(action.field).to.equal("name");
            expect(action.value).to.equal("bob");
            expect(action.type).to.equal(CHANGE_FORM);
        });
    });
    describe("changeErrorInForm", function () {
        it("sets the value", function () {
            let action = authForm.changeErrorInForm("error");
            expect(action.type).to.equal(AUTH_ERROR);
            expect(action.value).to.equal("error");
        });
    });
});