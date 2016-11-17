import * as chai from "chai";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

import { SET_SNACKBAR_MESSAGE } from "../constants";
import * as notification from "./notification";

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

chai.use(sinonChai);
let expect = chai.expect;

describe("Notification Action", function() {
    describe("displaySnackbar", function() {

        let clock: Sinon.SinonFakeTimers;

        beforeEach(function () {
            clock = sinon.useFakeTimers();
        });

        afterEach(function() {
            clock.restore();
        });

        it("sets the message with default duration", function() {
            let initialState = {};
            let store = mockStore(initialState);

            store.dispatch(notification.displaySnackbar("message"));
            let actions: any[] = store.getActions();
            expect(actions).to.have.length(1);

            clock.tick(1001);
            actions = store.getActions();
            expect(actions).to.have.length(2);
            expect(actions[0].type).to.equal(SET_SNACKBAR_MESSAGE);
            expect(actions[0].message).to.equal("message");
            expect(actions[1].type).to.equal(SET_SNACKBAR_MESSAGE);
            expect(actions[1].message).to.equal(undefined);
        });

        it("sets the message and duration", function() {
            let initialState = {};
            let store = mockStore(initialState);

            store.dispatch(notification.displaySnackbar("message", 2000));
            let actions: any[] = store.getActions();
            expect(actions).to.have.length(1);

            clock.tick(1001);
            actions = store.getActions();
            // make sure the other action hasn't fired yet
            expect(actions).to.have.length(1);

            clock.tick(1000);
            actions = store.getActions();
            expect(actions).to.have.length(2);
            expect(actions[0].type).to.equal(SET_SNACKBAR_MESSAGE);
            expect(actions[0].message).to.equal("message");
            expect(actions[1].type).to.equal(SET_SNACKBAR_MESSAGE);
            expect(actions[1].message).to.equal(undefined);
        });
    });
});