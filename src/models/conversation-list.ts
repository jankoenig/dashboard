import Conversation, {ConversationProperties} from "./conversation";
import Log from "./log";
import Output from "./output";
import StackTrace from "./stack-trace";

export type ConversationMap = {
    [id: string]: ConversationProperties
};

class ConversationList extends Array<Conversation> {

    static fromLogs(logs: Log[]): ConversationList {

        let conversations = new ConversationList();
        let conversationMap: ConversationMap = {};

        if (logs) {
            for (let log of logs) {

                // First make sure the map has an object there
                if (!conversationMap[log.transaction_id]) {
                    conversationMap[log.transaction_id] = { request: undefined, response: undefined, outputs: [], stackTraces: [] };
                }

                if (log.tags && log.tags.indexOf("request") > -1) {
                    conversationMap[log.transaction_id].request = log;
                }

                if (log.tags && log.tags.indexOf("response") > -1) {
                    conversationMap[log.transaction_id].response = log;
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
                return new Conversation(conversationMap[key]);
            });
        }

        return conversations;
    }
}

export default ConversationList;