import * as moment from "moment";
import String from "../utils/string";
import Conversation from "./conversation";
import ConversationList from "./conversation-list";
import Log from "./log";
import LogReceiver from "./LogReceiver";
import Session, { SessionProperties } from "./Session";
import SourceSummary, { SummaryDatum } from "./source-summary";
import StackTrace from "./stack-trace";

import {
    AUDIOPLAYER_PLAYBACK_FAILED,
    AUDIOPLAYER_PLAYBACK_FINISHED,
    AUDIOPLAYER_PLAYBACK_NEARLY_FINISHED,
    AUDIOPLAYER_PLAYBACK_STARTED,
    AUDIOPLAYER_PLAYBACK_STOPPED,
    LAUNCH_REQUEST
} from "../constants/alexa";

import DataUtil from "../utils/data";
import { TimeSeriesDatum } from "./time-series";

class ConversationListSummary implements SourceSummary {

    readonly startTime: Date | moment.Moment;

    readonly endTime: Date | moment.Moment;

    private userMap: { [userId: string]: Conversation[] } = {};

    get uniqueUsers(): string[] {
        return Object.keys(this.userMap);
    }

    get totalUniqueUsers(): number {
        return this.uniqueUsers.length;
    }

    private exceptions: { timestamp: Date, stackTrace: StackTrace }[] = [];

    get totalExceptions() {
        return this.exceptions.length;
    }

    private conversationEvents: TimeSeriesDatum[] = [];

    get events(): TimeSeriesDatum[] {
        return this.conversationEvents;
    }

    private conversationList: ConversationList;

    get totalEvents(): number {
        return this.conversationList.length;
    }

    private requestMap: { [request: string]: number } = {};

    get requestSummary(): SummaryDatum[] {
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

    public sessions: Session[] = [];

    public failedSessions: SessionProperties[] = [];

    private sessionMap: { [session: string]: number } = {};

    get sessionSummary(): SummaryDatum[] {
        let sessions = [];

        for (let key of Object.keys(this.sessionMap)) {
            sessions.push({ name: key, total: this.sessionMap[key] });
        }

        sessions.sort(function (a, b) {
            return b.total - a.total;
        });

        return sessions;
    }

    readonly eventLabel: string = "Conversations";

    private logReceiver: LogReceiver;

    log(message: string) {
        // console.log(message);
        if (this.logReceiver) {
            const timestamp = new Date();
            this.logReceiver.postLog(new Log({
                payload: message,
                log_type: "DEBUG",
                source: "summary",
                transaction_id: "",
                timestamp: timestamp,
                id: String.randomString(6)
            }));
        }
    }

    constructor(period: { startTime: Date | moment.Moment, endTime: Date | moment.Moment }, conversationList: ConversationList, logReceiver?: LogReceiver) {
        this.startTime = period.startTime;
        this.endTime = period.endTime;
        this.conversationList = conversationList;
        this.logReceiver = logReceiver;

        this.conversationEvents = DataUtil.convertToTimeSeries("hours", this.startTime, this.endTime, this.conversationList);
        this.log("generating summary");
        // The main data processing loop
        // Loop through the conversations and parse the data
        for (let conversation of this.conversationList) {

            // Add the userId to the user map.  It is a set essentially
            if (!this.userMap[conversation.userId]) {
                // make sure an empty array exists for the user ID
                let shortUserId = conversation.userId ? conversation.userId.substr(0, 22) : "undefined";
                this.log("Found new user " + shortUserId);
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
            // set the first prop
            let currentSessionProps: SessionProperties = {};
            let previousSession: Session;
            let shortUserId = key.substr(0, 22);
            this.log("Determining session for User " + shortUserId);

            // First sort by time
            conversations.sort(function (a, b) {
                return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
            });

            // Then iterate through and build the sessions
            for (let conversation of conversations) {

                this.log("Parsing " + conversation.requestPayloadType);

                // TODO: Can we find a better place to set this?
                currentSessionProps.userId = shortUserId;

                switch (conversation.requestPayloadType) {
                    case LAUNCH_REQUEST:
                        currentSessionProps.launch = conversation;
                        break;
                    case AUDIOPLAYER_PLAYBACK_STARTED:
                        // If we already have an end, reset it.  We need a start
                        if (currentSessionProps.end) {
                            this.log("-----RESET: ODD DATA-------");
                            this.failedSessions.push(currentSessionProps);
                            currentSessionProps = {}; // reset, somehow had an end before a start
                        } else {
                            this.log(conversation.requestPayloadType + " " + conversation.timestamp + " <-- START");
                            currentSessionProps.start = conversation;
                        }
                        break;
                    case AUDIOPLAYER_PLAYBACK_NEARLY_FINISHED:
                        // Skip this one for now, might be able to use it to determine the
                        // the next audio track queued up.
                        break;
                    case AUDIOPLAYER_PLAYBACK_STOPPED:
                    case AUDIOPLAYER_PLAYBACK_FINISHED:
                    case AUDIOPLAYER_PLAYBACK_FAILED:
                        this.log(conversation.requestPayloadType + " " + conversation.timestamp + " <-- END");
                        currentSessionProps.end = conversation;
                        break;
                    default:
                        currentSessionProps.content = conversation.requestPayloadType;
                        this.log("Setting audio content " + conversation.requestPayloadType + "  " + conversation.timestamp);
                        break;
                }

                // Our exit condition
                if (currentSessionProps.start && currentSessionProps.end) {

                    let session = new Session(currentSessionProps);
                    this.log("Adding a session of duration " + session.duration);
                    // console.log(session);
                    if (session.duration < 0) {
                        this.log("CAUGHT BAD DATA WITH NEGATIVE SESSION DURATION");
                    }
                    // console.log(session.content + " " + session.duration);
                    currentSessionProps = {};
                    this.log("==========================");

                    if (!this.sessionMap[session.content]) {
                        // Case where it doesn't exist
                        this.sessionMap[session.content] = session.duration;
                    } else {
                        let currentAverage = this.sessionMap[session.content];
                        this.sessionMap[session.content] = (currentAverage + session.duration) / 2;
                        this.log("Updating average duration " + currentAverage + " to " + this.sessionMap[session.content]);
                    }

                    let difference: number = Number.MAX_VALUE;

                    if (previousSession) {
                        console.log("=====");
                        console.log("previous end " + moment(previousSession.end.timestamp).format("h:mm:ss a"));
                        console.log("current start " + moment(session.start.timestamp).format("h:mm:ss a"));
                        let duration = moment.duration(moment(session.start.timestamp).diff(moment(previousSession.end.timestamp)));
                        difference = duration.asMinutes();
                        console.log("difference = " + duration.asMinutes());
                        console.log("=====");
                    }

                    // if it is less than three minutes from the previous
                    if (difference <= 3) {
                        // store it on the previous
                        previousSession.sessions.push(session);
                    } else {
                        // Set it to the previous
                        previousSession = session;
                        // or store it on the sessions array
                        this.sessions.push(session);
                    }
                    // and restart the loop
                }
            } // End Conversation Loop
        } // END User Map Loop

        // Sort the sessions.
        this.sessions.sort(function (a, b) {
            return new Date(b.start.timestamp).getTime() - new Date(a.start.timestamp).getTime();
        });
    }
}

export default ConversationListSummary;