import Log from "./log";

export interface ConversationProperties {
    request: Log;
    response: Log;
}

export default class Conversation implements ConversationProperties {

    readonly request: Log;

    readonly response: Log;

    constructor(props: ConversationProperties) {
        this.request = props.request;
        this.response = props.response;
    }

    get applicationId(): string {
        return this.request.payload.session.application.applicationId;
    }

    get sessionId(): string {
        return this.request.payload.session.sessionId;
    }

    get userId(): string {
        return this.request.payload.session.user.userId;
    }

    get requestType(): string {
        return this.request.payload.request.type;
    }

    get intent(): string | undefined {
        if (this.request.payload.request.intent) {
            return this.request.payload.request.intent.name;
        } else {
            return undefined;
        }
    }

    get timestamp(): Date {
        return this.request.timestamp;
    }
}

