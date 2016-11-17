import * as objectAssign from "object-assign";

import { SetSnackbarMessage } from "../actions/notification";
import { SET_SNACKBAR_MESSAGE } from "../constants";

export type NotificationState = {
    snackBarMessage?: string;
}

const INITIAL_STATE: NotificationState = {/* empty initial state */};

type NotificationAction = SetSnackbarMessage | { type: "" };

export function notification(state: NotificationState = INITIAL_STATE, action: NotificationAction ): NotificationState {
    switch (action.type) {
        case SET_SNACKBAR_MESSAGE:
            return objectAssign({}, state, { snackBarMessage: action.message });
        default:
            return state;
    }
}
