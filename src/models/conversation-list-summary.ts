import ConversationList from "./conversation-list";
import SourceSummary from "./source-summary";
import StackTrace from "./stack-trace";

import DataUtil from "../utils/data";
import { TimeSeriesDatum } from "./time-series";

class ConversationListSummary implements SourceSummary {

    private conversationList: ConversationList;
    private userMap: { [userId: string]: string } = {};
    private crashes: { timestamp: Date, stackTrace: StackTrace }[] = [];
    private conversationEvents: TimeSeriesDatum[] = [];

    readonly startTime: Date;

    readonly endTime: Date;

    get uniqueUsers(): string[] {
        return Object.keys(this.userMap);
    }

    get totalUniqueUsers(): number {
        return this.uniqueUsers.length;
    }

    get totalCrashes() {
        return this.crashes.length;
    }

    get events(): TimeSeriesDatum[] {
        return this.conversationEvents;
    }

    get totalEvents(): number {
        return this.conversationList.length;
    }

    readonly eventLabel: string = "Conversations";

    constructor(period: { startTime: Date, endTime: Date }, conversationList: ConversationList) {
        this.startTime = period.startTime;
        this.endTime = period.endTime;
        this.conversationList = conversationList;

        this.conversationEvents = DataUtil.convertToTimeSeries("hours", this.startTime, this.endTime, this.conversationList);

        // Loop through the conversations and parse the data
        for (let conversation of this.conversationList) {

            this.userMap[conversation.userId] = conversation.userId;

            if (conversation.hasCrash) {
                for (let stackTrace of conversation.stackTraces) {
                    this.crashes.push({
                        timestamp: stackTrace.timestamp,
                        stackTrace: stackTrace
                    });
                }
            }
        }
    }
}

export default ConversationListSummary;