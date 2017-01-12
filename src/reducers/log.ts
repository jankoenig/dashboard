import { FetchLogsRequestAction, SetLogsAction } from "../actions/log";
import { FETCH_LOGS_REQUEST, SET_LOGS } from "../constants";
import Log from "../models/log";
import LogQuery from "../models/log-query";

export type LogMap = {
    [sourceId: string]: {
        logs: Log[];
        query: LogQuery;
    }
};

export type LogState = {
    logMap?: LogMap;
    error?: string;
    isLoading: boolean;
};

const INITIAL_STATE: LogState = {
    isLoading: false
};

type LogAction = SetLogsAction | FetchLogsRequestAction | { type: "" };

export function log(state: LogState = INITIAL_STATE, action: LogAction): LogState {
    switch (action.type) {
        case FETCH_LOGS_REQUEST:
            return {...state, ... { isLoading: action.fetching }};

        case SET_LOGS:
            // Create a new logMap
            return setLogs(state, action);

        default:
            return state;
    }
}

function setLogs(state: LogState, action: SetLogsAction): LogState {
    const sourceId = action.query.source.id;
    const globalLogMap: LogMap = state.logMap;

    let logObj = (globalLogMap) ? globalLogMap[sourceId] : undefined;

    let logs: Log[];
    let query: LogQuery;

    if (logObj) {
        query = action.query;
        logs = logObj.logs.slice();
        logs = logs.concat(action.logs);
    } else {
        query = action.query;
        logs = action.logs;
    }

    let logMap: LogMap = {... globalLogMap, ... { [sourceId]: { logs: logs, query: query }}};

    // Create a new state with the new logMap
    return { ...state, ... { logMap: logMap }};
}