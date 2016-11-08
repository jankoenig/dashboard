import Log from "../models/log";
import Source from "../models/source";

/**
 * Returns a specified amount of dummy logs for unit testing
 *
 * @export
 * @param {number} length The number of logs
 * @returns {Log[]}
 */
export function dummyLogs(length: number): Log[] {

    let logs: Log[] = [];

    for (let i = 0; i < length; i++) {

        let tag: string = "response";
        let transaction_id: string = "" + (i - 1);

        // if 0 or even
        if (i === 0 || !(i & 1)) {
            tag = "request";
            transaction_id = "" + i;
        }

        // create a new dummy log
        let log = new Log({
            payload: "payload",
            log_type: "INFO",
            timestamp: new Date(),
            source: "source",
            transaction_id: transaction_id,
            tags: [tag],
            id: "" + i
        });

        logs.push(log);
    }
    return logs;
}

/**
 * Returns a specified amount of dummy sources for unit testing
 *
 * @export
 * @param {number} length
 * @returns {Source[]}
 */
export function dummySources(length: number): Source[] {

    let sources: Source[] = [];

    for (let i = 0; i < length; i++) {
        let source = new Source({ name: "Source Name"});

        sources.push(source);
    }

    return sources;
}