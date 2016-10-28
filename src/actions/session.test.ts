import * as chai from "chai";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";

import { SET_USER } from "../constants";
import User from "../models/user";
import * as session from "./session";

const middlewares = [ thunk ];
const mockStore = configureMockStore(middlewares);

let expect = chai.expect;

describe("Session actions", function () {
    it("sets the user", function() {
        let user = new User({ email: "email"});
        let initialState = {};

        let store = mockStore(initialState);
        store.dispatch(session.setUser(user));

        expect(store.getActions().length).to.equal(1);
        let action: any = store.getActions()[0];
        expect(action.type).to.equal(SET_USER);
    });
});