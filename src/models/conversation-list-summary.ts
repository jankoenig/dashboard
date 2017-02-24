// import * as moment from "moment";

import Conversation from "./conversation";
import ConversationList from "./conversation-list";
import Session, { SessionProperties } from "./Session";
import SourceSummary, { SummaryDatum } from "./source-summary";
import StackTrace from "./stack-trace";

import {
    AUDIOPLAYER_PLAYBACK_FAILED,
    AUDIOPLAYER_PLAYBACK_FINISHED,
    AUDIOPLAYER_PLAYBACK_STARTED,
    AUDIOPLAYER_PLAYBACK_STOPPED
} from "../constants/alexa";

import DataUtil from "../utils/data";
import { TimeSeriesDatum } from "./time-series";

class ConversationListSummary implements SourceSummary {

    private conversationList: ConversationList;

    private userMap: { [userId: string]: Conversation[] } = {};

    private requestMap: { [request: string]: number } = {};

    private sessionMap: { [session: string]: number} = {};

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

    get sessions(): SummaryDatum[] {
        let sessions = [];

        for (let key of Object.keys(this.sessionMap)) {
            sessions.push({name: key, total: this.sessionMap[key]});
        }

        sessions.sort(function(a, b) {
            return b.total - a.total;
        });

        return sessions;
    }

    readonly eventLabel: string = "Conversations";

    constructor(period: { startTime: Date, endTime: Date }, conversationList: ConversationList) {
        this.startTime = period.startTime;
        this.endTime = period.endTime;
        this.conversationList = conversationList;

        this.conversationEvents = DataUtil.convertToTimeSeries("hours", this.startTime, this.endTime, this.conversationList);
        console.log("generating conversation list summary");
        // The main data processing loop
        // Loop through the conversations and parse the data
        for (let conversation of this.conversationList) {

            // Add the userId to the user map.  It is a set essentially
            if (!this.userMap[conversation.userId]) {
                // make sure an empty array exists for the user ID
                this.userMap[conversation.userId] = [];
            }
            this.userMap[conversation.userId].push(conversation);

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

        // Now loop through the userMap to determine sessions
        for (let key in this.userMap) {
            let conversations: Conversation[] = this.userMap[key];
            let sessionProps: SessionProperties = {};

            console.log("looping user " + key);

            // First sort
            conversations.sort(function(a, b) {
                return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
            });

            // Then iterate through and build the sessions
            for (let conversation of conversations) {

                switch (conversation.requestPayloadType) {
                    case AUDIOPLAYER_PLAYBACK_STARTED:
                        if (sessionProps.end) {
                            console.log("-----RESET: ODD DATA-------");
                            sessionProps = {}; // reset, somehow had an end before a start
                        } else {
                            // console.log(conversation.requestPayloadType + " " + conversation.timestamp + " <-- START");
                            sessionProps.start = conversation;
                        }
                        break;
                    case AUDIOPLAYER_PLAYBACK_STOPPED:
                    case AUDIOPLAYER_PLAYBACK_FINISHED:
                    case AUDIOPLAYER_PLAYBACK_FAILED:
                        // console.log(conversation.requestPayloadType + " " + conversation.timestamp + " <-- END");
                        sessionProps.end = conversation;
                        break;
                    default:
                        sessionProps.content = conversation.requestPayloadType;
                        // console.log(conversation.requestPayloadType + "  " + conversation.timestamp);
                        break;
                }

                if (sessionProps.start && sessionProps.end) {

                    let session = new Session(sessionProps);
                    // console.log("resetting the props");
                    // console.log(session);
                    if (session.duration < 0) {
                        console.log("CAUGHT BAD DATA");
                    }
                    // console.log(session.content + " " + session.duration);
                    sessionProps = {};
                    // console.log("==========================");

                    if (!this.sessionMap[session.content]) {
                        // Case where it doesn't exist
                        this.sessionMap[session.content] = session.duration;
                    } else {
                        let currentAverage = this.sessionMap[session.content];
                        this.sessionMap[session.content] = (currentAverage + session.duration) / 2;
                    }
                }
            } // End Conversation Loop
        } // END User Map Loop
    }
}

export default ConversationListSummary;