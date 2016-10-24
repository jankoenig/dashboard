
import Log from "../models/log";

export function mockLogs(length: number) {

    let logs: Log[] = [];

    for (let i = 0; i < length; i++) {
        // create a new dummy log
        let log = new Log({
            payload: "payload",
            log_type: "INFO",
            timestamp: new Date(),
            source: "source",
            transaction_id: "" + i,
            tags: [],
            id: "" + i
        });

        logs.push(log);
    }
    return logs;
}