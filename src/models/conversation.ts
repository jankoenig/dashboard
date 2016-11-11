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

    get id(): string {
        return this.request.id;
    }

    get applicationId(): string {
        return this.request.payload.session.application.applicationId;
    }

    get sessionId(): string {
        return this.request.payload.session.sessionId;
    }

    get userId(): string | undefined {

        let userId: string | undefined = undefined;

        if (this.request.payload.session.user) {
            userId = this.request.payload.session.user.userId;
        } else if (this.request.payload.context && this.request.payload.context.System.user) {
            userId = this.request.payload.context.System.user.userId;
        }

        return userId;
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

