import { FETCH_LOGS_REQUEST, SET_LOGS } from "../constants";
import Log from "../models/log";
import LogQuery from "../models/log-query";
import Source from "../models/source";
import service from "../services/log";

export type SetLogsAction = {
    type: SET_LOGS,
    source: Source,
    logs: Log[]
}

export function setLogs(source: Source, logs: Log[]): SetLogsAction {
    return {
        type: SET_LOGS,
        source: source,
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

export function getLogs(source: Source) {
    return function (dispatch: Redux.Dispatch<any>) {

        dispatch(fetchLogsRequest());

        // Right now we are only looking for the last seven days
        let startTime: Date = new Date();
        startTime.setDate(startTime.getDate() - 7);

        let query: LogQuery = new LogQuery({
            source: source,
            startTime: startTime
        });
        return service.getLogs(query).then(function (logs) {
            dispatch(setLogs(source, logs));
        });
    };
}