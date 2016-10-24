import { expect } from "chai";

import { setLogs } from "../actions/log";
import Log from "../models/log";
import { logReducer } from "./log";

describe("Log Reducer", function() {

    function mockLogs(length: number) {

        let logs: Log[] = [];

        for (let i = 0; i < length; i++) {
            // create a new dummy log
            let log = new Log({
                payload: "payload",
                log_type: "INFO",
                timestamp: new Date(),
                source: "source",
                transaction_id: "" + i,
                tags: [],
                id: "" + i
            });

            logs.push(log);
        }
        return logs;
    }

    describe("set logs action", function() {
        it("sets the logs", function() {

            let state = {
                isLoading: true
            };

            let action = setLogs(mockLogs(4));

            let newState = logReducer(state, action);

            expect(newState.logs).to.exist;
            expect(newState.logs).to.have.length(4);
            // Make sure the existing state is not modified
            expect(newState.isLoading).to.equal(state.isLoading);
        });
    });
    describe("unknown action", function() {
        it("passes the state through", function() {

            let state = {
                isLoading: false
            };

            let newState = logReducer(state, {type: ""});

            expect(newState.isLoading).to.equal(state.isLoading);
            expect(newState.logs).to.be.undefined;
            expect(newState.error).to.be.undefined;
        });
    });
});