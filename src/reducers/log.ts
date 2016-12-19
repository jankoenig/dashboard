import * as objectAssign from "object-assign";

import { FetchLogsRequestAction, SetLogsAction} from "../actions/log";
import { FETCH_LOGS_REQUEST, SET_LOGS } from "../constants";
import Log from "../models/log";



export type LogState = {
    logMap?: {[sourceId: string]: Log[]};
    logs?: Log[];
    error?: string;
    isLoading: boolean;
}

const INITIAL_STATE: LogState = {
    isLoading: false
};

type LogAction = FetchLogsRequestAction | SetLogsAction | { type: "" };

export function log(state: LogState = INITIAL_STATE, action: LogAction ): LogState {
    switch (action.type) {
        case FETCH_LOGS_REQUEST:
            return objectAssign({}, state, { isLoading: true });
        case SET_LOGS:
            return objectAssign({}, state, { logs: action.logs });
        default:
            return state;
    }
}