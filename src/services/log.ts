import "isomorphic-fetch";

import Log from "../models/log";
import LogQuery from "../models/log-query";

export namespace log {

    export function getLogs(query: LogQuery): Promise<Log[]> {

        let baseUrl = "https://logless.bespoken.tools/v1";
        let url = baseUrl + "/query?" + query.queryString;

        return fetch(url).then(function (response) {
            return response.json();
        }).then(function (json) {
            let data: any[] = json.data;
            let logs: Log[] = [];

            for (let logData of data) {
                let log = new Log(logData);
                logs.push(log);
            }

            return logs;
        });
    }
}

export default log;
