import * as chai from "chai";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";

// import * as sinon from "sinon";
// import * as sinonChai from "sinon-chai";
// import * as auth from "../services/auth";

import { SET_USER } from "../constants";
import User from "../models/user";
import * as session from "./session";


const middlewares = [ thunk ];
const mockStore = configureMockStore(middlewares);

// Setup chai with sinon-chai
// chai.use(sinonChai);
let expect = chai.expect;

describe("Session Actions", function () {
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