import { expect } from "chai";
import { createStore } from "redux";

import rootReducer from "./index";

/**
 * rootReducer Testing help outlined here: https://github.com/reactjs/redux/issues/1412#issuecomment-184696008
 *
 */
describe("rootReducer", function() {
    it("returns the initial state", function() {
        let store = createStore(rootReducer);
        expect(store.getState().authForm).to.exist;
        expect(store.getState().session).to.exist;
        expect(store.getState().source).to.exist;
        expect(store.getState().log).to.exist;
        expect(store.getState().routing).to.exist;
    });
});