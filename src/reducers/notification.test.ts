import { expect } from "chai";

import { setSnackbarMessage } from "../actions/notification";
import { notification } from "./notification";

describe("Notification Reducer", function() {
    describe("set snackbar action", function() {
        it("sets the message", function() {
            let newState = notification(undefined, setSnackbarMessage("message"));
            expect(newState.snackBarMessage).to.equal("message");
        });
    });
});