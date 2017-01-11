import { FETCH_LOGS_REQUEST, SET_LOGS } from "../constants";
import Log from "../models/log";
import LogQuery from "../models/log-query";
import Source from "../models/source";
import service from "../services/log";

export type SetLogsAction = {
    type: SET_LOGS,
    query: LogQuery,
    logs: Log[]
};

export function setLogs(query: LogQuery, logs: Log[]): SetLogsAction {
    return {
        type: SET_LOGS,
        query: query,
        logs: logs
    };
}

export type FetchLogsRequestAction = {
    type: FETCH_LOGS_REQUEST
};

/**
 * A Log Request was initiated.  Used primarily by the UI to show a network process has started.
 *
 * @export
 * @returns
 */
export function fetchLogsRequest() {
    return {
        type: FETCH_LOGS_REQUEST
    };
}

/**
 * Deprecated. Use retrieveLogs.
 *
 * This function will retrieve logs with the given source. If a startTime is not given,
 * then it will retrieve logs from the last seven days.
 *
 * After logs are retreived, an to SET_LOGS will be thrown.
 */
export function getLogs(source: Source, startTime?: Date, endTime?: Date) {
    if (!startTime) {
        // Right now we are only looking for the last seven days
        startTime = new Date();
        startTime.setDate(startTime.getDate() - 7);
    }

    let query: LogQuery = new LogQuery({
        source: source,
        startTime: startTime,
        endTime: endTime
    });

    return retrieveLogs(query);
}

/**
 * A logs query that will first throw a FETCH_LOGS_REQUEST action then set the global
 * logs state once logs have been retrieved.
 *
 * @param logQuery: The query to perform when retrievings logs.
 */
export function retrieveLogs(logQuery: LogQuery): (dispatch: Redux.Dispatch<Log[]>) => Promise<Log[]> {
    return function (dispatch: Redux.Dispatch<Log[]>): Promise<Log[]> {
        dispatch(fetchLogsRequest());

        return service.getLogs(logQuery).then(function (logs: Log[]) {
            dispatch(setLogs(logQuery, logs));
            return logs;
        });
    };
}