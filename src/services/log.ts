import "isomorphic-fetch";

import Log from "../models/log";
import LogQuery from "../models/log-query";

namespace LogService {

    export function getLogs(query: LogQuery): Promise<Log[]> {

        let baseUrl = LOGLESS_BASE;
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

export default LogService;