import * as moment from "moment";

import DateUtil from "../utils/date";
import ConversationList from "./conversation-list";
import SourceSummary, { EventDatum } from "./source-summary";

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

    get totalUniqueUsers(): number {
        return this.uniqueUsers.length;
    }

    get crashes() {

        let crashes = [];

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

    get totalCrashes() {
        return this.crashes.length;
    }

    get events(): EventDatum[] {

        let keyFormat = "Y-M-D HH";

        let events: EventDatum[] = [];
        let eventMap: { [time: string]: string[] } = {};
        let timeBuckets = DateUtil.timeBuckets(this.startTime, this.endTime, "hours");

        // From the time buckets, create a map of empty arrays with a common time stamp
        for (let time of timeBuckets) {
            let key = moment(time).format(keyFormat);
            eventMap[key] = [];
        }

        // For each conversation, push the event to the corresponding bucket
        for (let conversation of this.conversationList) {
            let key = moment(conversation.timestamp).format(keyFormat);
            eventMap[key].push(conversation.id);
        }

        // And finally, push each timestamp key to the events array with how many events occured on that day
        for (let key in eventMap) {
            events.push({
                timestamp: moment(key, keyFormat).toDate(),
                events: eventMap[key].length
            });
        }

        return events;

    }

    get totalEvents(): number {
        return this.conversationList.length;
    }

    eventLabel: string = "Conversations";

    constructor(period: { startTime: Date, endTime: Date }, conversationList: ConversationList) {
        this.startTime = period.startTime;
        this.endTime = period.endTime;
        this.conversationList = conversationList;
    }

}

export default ConversationListSummary;