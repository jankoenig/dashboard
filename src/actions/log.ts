import { SET_LOGS } from "../constants";
import Log from "../models/log";
import log from "../services/log";

export type SetLogsAction = {
    type: SET_LOGS
    logs: Log[]
}

export function setLogs(logs: Log[]): SetLogsAction {
    return {
        type: SET_LOGS,
        logs: logs
    };
}

export function getLogs(source: string) {
    return function (dispatch: Redux.Dispatch<any>) {

        let startTime: Date = new Date();
        startTime.setDate(startTime.getDate() - 10);

        let query: log.Query = {
            source: "happy_xapp",
            startTime: startTime
        };
        log.getLogs(query, function (logs) {
            dispatch(setLogs(logs));
        });
    };
}