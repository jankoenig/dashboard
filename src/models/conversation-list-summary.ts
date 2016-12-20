import ConversationList from "./conversation-list";
import SourceSummary, { CrashDatum, EventDatum } from "./source-summary";

class ConversationListSummary implements SourceSummary {

    private conversationList: ConversationList;

    readonly startTime: Date;

    readonly endTime: Date;

    get uniqueUsers(): string[] {

        let usersMap: { [userId: string]: string } = {};

        for (let conversation of this.conversationList) {
            usersMap[conversation.userId] = conversation.userId;
        }

        return Object.keys(usersMap);
    }

    get crashes(): CrashDatum[] {

        let crashes: CrashDatum[] = [];

        for (let conversation of this.conversationList) {
            if (conversation.hasCrash) {
                for (let stackTrace of conversation.stackTraces) {
                    crashes.push({
                        timestamp: stackTrace.timestamp,
                        stackTrace: stackTrace
                    });
                }
            }
        }

        return crashes;
    }

    get events(): EventDatum[] {

        let events: EventDatum[] = [];

        for (let conversation of this.conversationList) {
            if (conversation.intent) {
                events.push({
                    timestamp: conversation.timestamp,
                    event: conversation.intent
                });
            }
        }

        return events;

    }

    constructor(period: {startTime: Date, endTime: Date}, conversationList: ConversationList) {
        this.startTime = period.startTime;
        this.endTime = period.endTime;
        this.conversationList = conversationList;
        console.log(this);
    }

}

export default ConversationListSummary;