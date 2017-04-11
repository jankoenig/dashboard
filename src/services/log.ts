import "isomorphic-fetch";

import Log from "../models/log";
import LogQuery from "../models/log-query";
import Query from "../models/query";

namespace LogService {

    export type Origin = "Google.Home" | "Amazon.Alexa";

    export interface Count {
        readonly count: number;
    }

    export interface TimeBucket extends Count {
        readonly date: string;
    }

    export interface TimeSummary {
        readonly buckets: TimeBucket[];
        readonly amazonBuckets: TimeBucket[];
        readonly googleBuckets: TimeBucket[];
    }

    export interface IntentBucket {
        readonly name: string;
        readonly count: number;
        readonly origin: Origin;
    }

    export interface IntentSummary {
        readonly count: IntentBucket[];
    }

    export interface TotalStat {
        readonly totalUsers: number;
        readonly totalExceptions: number;
        readonly totalEvents: number;
    }

    export interface SourceStats {
        readonly source: string;
        readonly stats: TotalStat;
        readonly "Amazon.Alexa": TotalStat;
        readonly "Google.Home": TotalStat;
        readonly Unknown: TotalStat;
    }

    // let BASE_URL = LOGLESS_BASE; // TODO: Get this to work with Mocha
    const BASE_URL = "https://logless.bespoken.tools/v1";
    // const BASE_URL = "https://logless-dev.bespoken.tools/v1";

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

    export function getSourceSummary(query: Query): Promise<SourceStats> {
        let url = BASE_URL + "/sourceStats?" + query.query();
        return fetchJson(url);
    }

    function fetchJson(url: string): Promise<any> {
        return fetch(url).then(function (response) {
            return response.json();
        });
    }
}

export default LogService;