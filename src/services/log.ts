import "isomorphic-fetch";

import Log from "../models/log";

export namespace log {

    export interface Query {
        source: string;
        startTime: Date;
        endTime?: Date;
    }

    export function queryBuilder(query: Query) {
        let queryString: string = "";

        queryString += "source=" + query.source;

        queryString += "&start_time=" + query.startTime.toISOString();

        if (query.endTime) {
            queryString += "&end_time=" + query.endTime.toISOString();
        }

        return queryString;
    }

    export function getLogs(query: Query): Promise<Log[]> {

        let baseUrl = "http://logless-server-049ff85c.4a0ac639.svc.dockerapp.io:3000/v1";
        let url = baseUrl + "/query?" + log.queryBuilder(query);

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
