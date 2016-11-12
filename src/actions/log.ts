import { FETCH_LOGS_REQUEST, SET_LOGS } from "../constants";
import Log from "../models/log";
import service from "../services/log";

export type SetLogsAction = {
    type: SET_LOGS,
    logs: Log[]
}

export function setLogs(logs: Log[]): SetLogsAction {
    return {
        type: SET_LOGS,
        logs: logs
    };
}

export type FetchLogsRequestAction = {
    type: FETCH_LOGS_REQUEST
}

export function fetchLogsRequest() {
    return {
        type: FETCH_LOGS_REQUEST
    };
}

export function getLogs(source: string) {
    return function (dispatch: Redux.Dispatch<any>) {

        dispatch(fetchLogsRequest());

        let startTime: Date = new Date();
        startTime.setDate(startTime.getDate() - 10);

        let query: service.Query = {
            source: source,
            startTime: startTime
        };
        return service.getLogs(query).then(function (logs) {
            // console.log(logs);
            dispatch(setLogs(logs));
        });
    };
}