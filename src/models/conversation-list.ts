import Conversation, { createConvo } from "./conversation";
import Log from "./log";
import Output from "./output";
import StackTrace from "./stack-trace";

export type ConversationMap = {
    readonly [id: string]: Conversation
};

class ConversationList extends Array<Conversation> {

    static fromLogs(logs: Log[]): ConversationList {

        let conversations = new ConversationList();
        let conversationMap: any = {};

        if (logs) {
            for (let log of logs) {

                // First make sure the map has an object there
                if (!conversationMap[log.transaction_id]) {
                    conversationMap[log.transaction_id] = { request: undefined, response: undefined, outputs: [], stackTraces: [] };
                }

                if (log.tags) {
                    let obj: any = {};
                    // Assuming you can't have both.  Else it's wrong if that's the case.
                    if (log.tags.indexOf("request") > -1) {
                        obj = {...obj, ...{ request: log }};
                    }

                    if (log.tags.indexOf("response") > -1) {
                        obj = {... obj, ...{ response: log }};
                    }

                    const convo = conversationMap[log.transaction_id];
                    conversationMap[log.transaction_id] = {...convo, ...obj};
                }

                if (typeof log.payload === "string") {
                    if (log.stack) {
                        // We got one with a stack, parse it as a stack-trace
                        conversationMap[log.transaction_id].stackTraces.push(StackTrace.fromLog(log));
                    } else {
                        // No stack, just a normal output
                        conversationMap[log.transaction_id].outputs.push(Output.fromLog(log));
                    }
                }
            }

            // convert to an array
            conversations = Object.keys(conversationMap).map(function (key) {
                return createConvo(conversationMap[key]);
            });
        }

        return conversations;
    }
}

export default ConversationList;