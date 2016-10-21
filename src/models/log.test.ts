import { expect } from "chai";

import Log from "./log";
import { LogProperties } from "./log";

describe("Log", function () {
    describe("constructor", function () {
        it("sets all properties", function () {
            let logProperties: LogProperties = {
                payload: "payload",
                stack: "stack",
                log_type: "INFO",
                source: "source",
                transaction_id: "transaction_id",
                timestamp: new Date(),
                tags: ["tag1", "tag2"],
                id: "id"
            };

            let log = new Log(logProperties);

            expect(log.payload).to.equal("payload");
            expect(log.stack).to.equal("stack");
            expect(log.log_type).to.equal("INFO");
            expect(log.source).to.equal("source");
            expect(log.transaction_id).to.equal("transaction_id");
            expect(log.timestamp).to.exist;
            expect(log.tags).to.deep.equal(["tag1", "tag2"]);
            expect(log.id).to.equal("id");
        });
    });
});