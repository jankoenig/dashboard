import * as objectAssign from "object-assign";

import { FetchLogsRequestAction, SetLogsAction } from "../actions/log";
import { FETCH_LOGS_REQUEST, SET_LOGS } from "../constants";
import Log from "../models/log";
import LogQuery from "../models/log-query";

export type LogMap = {
    [sourceId: string]: {
        logs: Log[], query: LogQuery
    }
};

export type LogState = {
    logMap?: LogMap;
    logs?: Log[];
    error?: string;
    isLoading: boolean;
};

const INITIAL_STATE: LogState = {
    isLoading: false
};

type LogAction = FetchLogsRequestAction | SetLogsAction | { type: "" };

export function log(state: LogState = INITIAL_STATE, action: LogAction): LogState {
    switch (action.type) {
        case FETCH_LOGS_REQUEST:
            return objectAssign({}, state, { isLoading: true });
        case SET_LOGS:
            // Create a new logMap
            let logMap = objectAssign({}, state.logMap, { [action.query.source.id]: { query: action.query, logs: action.logs }});
            // Create a new state with the new logMap
            return objectAssign({}, state, { logMap: logMap, logs: action.logs });
        default:
            return state;
    }
}