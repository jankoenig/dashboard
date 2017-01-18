import "isomorphic-fetch";

import Log from "../models/log";
import LogQuery from "../models/log-query";
import Query from "../models/query";

namespace LogService {

    export interface Count {
        count: number;
    }

    export interface TimeBucket extends Count {
        date: string;
    }

    export interface TimeSummary {
        buckets: TimeBucket[];
    }

    export interface IntentBucket {
        name: string;
        count: number;
    }

    export interface IntentSummary {
        count: IntentBucket[];
    }

    // let BASE_URL = LOGLESS_BASE; // TODO: Get this to work with Mocha
    const BASE_URL = "https://logless.bespoken.tools/v1";

    export function getLogs(query: LogQuery): Promise<Log[]> {

        let url = BASE_URL + "/query?" + query.queryString;

        return fetchJson(url).then(function (json) {
            let data: any[] = json.data;
            let logs: Log[] = [];

            for (let logData of data) {
                let log = new Log(logData);
                logs.push(log);
            }

            return logs;
        });
    }

    export function getTimeSummary(query: Query): Promise<TimeSummary> {
        let url = BASE_URL + "/timeSummary?" + query.query();
        return fetchJson(url);
    }

    export function getIntentSummary(query: Query): Promise<IntentSummary> {
        let url = BASE_URL + "/intentCount?" + query.query();
        return fetchJson(url);
    }

    function fetchJson(url: string): Promise<any> {
        return fetch(url).then(function (response) {
            return response.json();
        });
    }
}

export default LogService;