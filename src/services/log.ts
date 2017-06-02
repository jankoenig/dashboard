import "isomorphic-fetch";

import Log from "../models/log";
import LogQuery from "../models/log-query";
import Query from "../models/query";

namespace LogService {

    export type Origin = "Google.Home" | "Amazon.Alexa";

    export interface Count {
        count: number;
    }

    export interface TimeBucket extends Count {
        date: string;
    }

    export interface TimeSummary {
        buckets: TimeBucket[];
        amazonBuckets: TimeBucket[];
        googleBuckets: TimeBucket[];
    }

    export interface IntentBucket {
        name: string;
        count: number;
        origin: Origin;
    }

    export interface IntentSummary {
        count: IntentBucket[];
    }

    export interface ResponseTimeSummary {
      interval: string;
      avgResponseTime: number;
    }

    export interface TotalStat {
        totalUsers: number;
        totalExceptions: number;
        totalEvents: number;
    }

    export interface SourceStats {
        source: string;
        stats: TotalStat;
        "Amazon.Alexa": TotalStat;
        "Google.Home": TotalStat;
        Unknown: TotalStat;
    }

    // let BASE_URL = LOGLESS_BASE; // TODO: Get this to work with Mocha
    const BASE_URL = "https://logless.bespoken.tools/v1";
    // const BASE_URL = "https://logless-dev.bespoken.tools/v1";

    export function getTransactionUrl(convoId: string): string {
        return BASE_URL + "/transaction?id=" + convoId;
    }

    export function getLogs(query: LogQuery, url?: string): Promise<Log[]> {
        if (!url) {
            url = BASE_URL + "/query?" + query.queryString;
        }
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

    export function getResponseTimeSummary(query: Query): Promise<ResponseTimeSummary> {
      let url = BASE_URL + "/response-time?" + query.query();
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
