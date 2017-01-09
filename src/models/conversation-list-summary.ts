import ConversationList from "./conversation-list";
import SourceSummary, { SummaryDatum } from "./source-summary";
import StackTrace from "./stack-trace";

import DataUtil from "../utils/data";
import { TimeSeriesDatum } from "./time-series";

class ConversationListSummary implements SourceSummary {

    private conversationList: ConversationList;

    private userMap: { [userId: string]: string } = {};

    private requestMap: { [request: string]: number } = {};

    private exceptions: { timestamp: Date, stackTrace: StackTrace }[] = [];

    private conversationEvents: TimeSeriesDatum[] = [];

    readonly startTime: Date;

    readonly endTime: Date;

    get uniqueUsers(): string[] {
        return Object.keys(this.userMap);
    }

    get totalUniqueUsers(): number {
        return this.uniqueUsers.length;
    }

    get totalExceptions() {
        return this.exceptions.length;
    }

    get events(): TimeSeriesDatum[] {
        return this.conversationEvents;
    }

    get totalEvents(): number {
        return this.conversationList.length;
    }

    get requests(): SummaryDatum[] {
        let requests = [];
        // iterate through the keys of the map
        for (let key of Object.keys(this.requestMap)) {
            // and add them to the requests array
            requests.push({ name: key, total: this.requestMap[key] });
        }

        // then sort
        requests.sort(function (a, b) {
            // in descending order
            return b.total - a.total;
        });

        return requests;
    }

    readonly eventLabel: string = "Conversations";

    constructor(period: { startTime: Date, endTime: Date }, conversationList: ConversationList) {
        this.startTime = period.startTime;
        this.endTime = period.endTime;
        this.conversationList = conversationList;

        this.conversationEvents = DataUtil.convertToTimeSeries("hours", this.startTime, this.endTime, this.conversationList);

        // The main data processing loop
        // Loop through the conversations and parse the data
        for (let conversation of this.conversationList) {

            // Add the userId to the user map.  It is a set essentially
            this.userMap[conversation.userId] = conversation.userId;

            // Add the intent
            if (conversation.requestPayloadType) {
                if (this.requestMap[conversation.requestPayloadType]) {
                    // it exists, increase the count
                    ++this.requestMap[conversation.requestPayloadType];
                } else {
                    // it doesn't exist, add it
                    this.requestMap[conversation.requestPayloadType] = 1;
                }
            }

            // if the conversation has a crash
            if (conversation.hasException) {
                for (let stackTrace of conversation.stackTraces) {
                    // add each to the array of crashes
                    this.exceptions.push({
                        timestamp: stackTrace.timestamp,
                        stackTrace: stackTrace
                    });
                }
            }
        }
    }
}

export default ConversationListSummary;