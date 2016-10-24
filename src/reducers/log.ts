import * as objectAssign from "object-assign";

import {SetLogsAction} from "../actions/log";
import {SET_LOGS} from "../constants";
import Log from "../models/log";

export type LogState = {
    logs?: Log[];
    source?: string;
    error?: string;
    isLoading: boolean;
}

const INITIAL_STATE: LogState = {
    isLoading: false
};

type LogAction = SetLogsAction | { type: "" };

export function logReducer(state: LogState = INITIAL_STATE, action: LogAction ) {
    switch (action.type) {
        case SET_LOGS:
            let logState: LogState = objectAssign({}, state, { logs: action.logs });
            return logState;
        default:
            return state;
    }
}