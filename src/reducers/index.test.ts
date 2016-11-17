import { expect } from "chai";
import { createStore } from "redux";

import { setCurrentSource } from "../actions/source";
import { LOGOUT_USER } from "../constants";
import Source from "../models/source";
import rootReducer from "./index";

/**
 * rootReducer Testing help outlined here: https://github.com/reactjs/redux/issues/1412#issuecomment-184696008
 */
describe("rootReducer", function() {
    it("returns the initial state", function() {
        let store = createStore(rootReducer);
        expect(store.getState().authForm).to.exist;
        expect(store.getState().session).to.exist;
        expect(store.getState().source).to.exist;
        expect(store.getState().log).to.exist;
        expect(store.getState().routing).to.exist;
        expect(store.getState().notification).to.exist;
    });
    it("resets on logout", function() {
        let store = createStore(rootReducer);

        // populate the store with some data
        let source = new Source({name: "Source"});
        store.dispatch(setCurrentSource(source));
        expect(store.getState().source.currentSource).to.equal(source);

        // send the logout action
        store.dispatch({type: LOGOUT_USER});
        // and ensure the data is cleared
        expect(store.getState().source.currentSource).to.be.undefined;
    });
});