
import Log from "../models/log";


/**
 * Returns a specified amount of fake logs for unit testing
 *
 * @export
 * @param {number} length The number of logs
 * @returns {Log[]}
 */
export function mockLogs(length: number): Log[] {

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