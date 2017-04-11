import { FETCH_LOGS_REQUEST, SET_LOGS } from "../constants";
import Log from "../models/log";
import LogQuery from "../models/log-query";
import Source from "../models/source";
import { LogQueryEvent } from "../reducers/log";
import service from "../services/log";

export interface PageResults {
    readonly newLogs: Log[];
    readonly oldLogs: Log[];
    readonly totalLogs: Log[];
}

export type SetLogsAction = {
    type: SET_LOGS,
    query: LogQuery,
    append: boolean,
    logs: Log[]
};

export function setLogs(query: LogQuery, logs: Log[], append: boolean = false): SetLogsAction {
    return {
        type: SET_LOGS,
        query: query,
        append: append,
        logs: logs
    };
}

export type FetchLogsRequestAction = {
    type: FETCH_LOGS_REQUEST,
    fetching: boolean;
};

/**
 * A Log Request was initiated.  Used primarily by the UI to show a network process has started.
 */
export function fetchLogsRequest(fetching: boolean) {
    return {
        type: FETCH_LOGS_REQUEST,
        fetching: fetching
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

    return retrieveLogs(query, false);
}

/**
 * A logs query that will first throw a FETCH_LOGS_REQUEST action then set the global
 * logs state once logs have been retrieved.
 *
 * @param logQuery: The query to perform when retrievings logs.
 */
export function retrieveLogs(logQuery: LogQuery, append?: boolean): (dispatch: Redux.Dispatch<Log[]>) => Promise<Log[]> {
    return function (dispatch: Redux.Dispatch<Log[]>): Promise<Log[]> {
        dispatch(fetchLogsRequest(true));
        return service.getLogs(logQuery)
        .then(function (logs: Log[]) {
            dispatch(setLogs(logQuery, logs, append));
            return logs;
        }).then(function (logs: Log[]) {
            dispatch(fetchLogsRequest(false));
            return logs;
        }).catch(function (err: Error) {
            dispatch(fetchLogsRequest(false));
            throw err;
        });
    };
}

/**
 * Retrieves the next page of logs and appends them to the current set of logs.  This will also set the global state
 * with the newly appended logs.
 *
 * @param logMap: The last query.
 * @param limit: the maximum number of logs to retrieve in this page.
 *
 * @returns A PageResults object that contains the new logs found with the old and total.
 */
export function nextPage(logQueryEvent: LogQueryEvent, limit?: number): (dispatch: Redux.Dispatch<Log[]>) => Promise<PageResults> {
    const oldLogs = logQueryEvent.logs || [];
    const lastLog = oldLogs[oldLogs.length - 1];
    const endTime = (lastLog) ? new Date(lastLog.timestamp) : logQueryEvent.query.endTime;
    const query = new LogQuery({
        source: logQueryEvent.query.source,
        startTime: logQueryEvent.query.startTime,
        endTime: endTime,
        limit: limit
    });

    return function (dispatch: Redux.Dispatch<Log[]>): Promise<PageResults> {
        dispatch(fetchLogsRequest(true));

        return service.getLogs(query).
            then(function (newLogs: Log[]) {
                const combined = oldLogs.slice().concat(newLogs);
                return { newLogs: newLogs, oldLogs: oldLogs, totalLogs: combined };
            }).then(function (results: PageResults) {
                dispatch(setLogs(logQueryEvent.query, results.totalLogs, false));
                return results;
            }).then(function (results: PageResults) {
                dispatch(fetchLogsRequest(false));
                return results;
            }).catch(function (err: Error) {
                dispatch(fetchLogsRequest(false));
                throw err;
            });
    };
}

/**
 * Retrieves the latest logs from the most recent log to the most recent found Log to the start date of the query.
 * It will then set the new logs with the pre-pended logs.  This assumes the current logs are already in order from
 * most recent to oldest.  The end time will be moved up to *now* instead of what was last implemented in the last query.
 *
 * @param logMap: The last query.
 *
 * @returns A PageResults object that contains the new logs found with the old and total.
 *
 */
export function findLatest(logQueryEvent: LogQueryEvent): (dispatch: Redux.Dispatch<Log[]>) => Promise<PageResults> {
    const oldLogs = logQueryEvent.logs || [];
    const firstLog = oldLogs[0];
    const startTime = (firstLog) ? new Date(firstLog.timestamp) : logQueryEvent.query.startTime;
    const query = new LogQuery({
        source: logQueryEvent.query.source,
        startTime: startTime,
        endTime: new Date()
    });

    return function (dispatch: Redux.Dispatch<PageResults>): Promise<PageResults> {
        dispatch(fetchLogsRequest(true));

        return service.getLogs(query).
            then(function (newLogs: Log[]) {
                const combined = newLogs.concat(oldLogs);
                return { newLogs: newLogs, oldLogs: oldLogs, totalLogs: combined };
            }).then(function (result: PageResults) {
                const oldQuery = logQueryEvent.query;
                let newQuery = { ... oldQuery, ... { endTime: query.endTime }};
                dispatch(setLogs(newQuery, result.totalLogs, false));
                return result;
            }).then(function (result: PageResults) {
                dispatch(fetchLogsRequest(false));
                return result;
            }).catch(function (err: Error) {
                dispatch(fetchLogsRequest(false));
                throw err;
            });
    };
}