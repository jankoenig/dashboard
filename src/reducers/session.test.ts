import { expect } from "chai";

import { setUser } from "../actions/session";
import User  from "../models/user";
import { session } from "./session";

describe("Session Reducer", function () {
    it("returns the initial state", function () {
        let newState = session(undefined, { type: "" });
        expect(newState.hasError).to.be.false;
        expect(newState.isLoading).to.be.false;
        expect(newState.user).to.be.undefined;
    });
    describe("SetUser Action", function() {
        it("sets the user", function() {
            let newUser = new User({email: "email"});
            let setUserAction = setUser(newUser);
            let newState = session(undefined, setUserAction);
            expect(newState.user).to.equal(newUser);
        });
    });
});