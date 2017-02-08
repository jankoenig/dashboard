import { LOG_LEVELS } from "../constants";
import Color from "../utils/color";
import Log from "./log";
import Output from "./output";
import StackTrace from "./stack-trace";

export type ConversationLevel = LOG_LEVELS;

export enum Origin {
    AmazonAlexa, GoogleHome, Unknown
}

export interface ConvoColors {
    fill: string;
    background: string;
}

export interface ConversationProperties {
    request: Log;
    response: Log;
    outputs?: Output[];
    stackTraces?: StackTrace[];
}

export interface Conversation {
    request: Log;
    response: Log;
    outputs: Output[];
    stackTraces: StackTrace[];
    origin: Origin;
    id: string | undefined;
    sessionId: string | undefined;
    userId: string | undefined;
    userColors: ConvoColors;
    /**
     * The raw request type unmodified as it is in the conversation.
     */
    rawRequestType: string | undefined;

    /**
     * The type of the request.  This is the item that goes before the "." of a name;
     *
     * In an Amazon generated request/intent generally looks like this:
     *
     * "request.intent".
     *
     * This is the "request" part of the string.
     */
    requestType: string | undefined;

    /**
     * The request type and if it is an "IntentRequest", will include the intent as well.
     */
    requestPayloadType: string | undefined;
    intent: string | undefined;
    timestamp: Date | undefined;
    hasError: boolean;
    hasException: boolean;
    isType(type: ConversationLevel | string): boolean;
    hasOutputType(type: string): boolean;
}

export function createConvo(props: ConversationProperties): Conversation {
    if (props.request) {
        const requestPayload = props.request.payload;
        if (requestPayload.session) { // amazon
            return new AlexaConversation(props);
        } else if (requestPayload.originalRequest) { // google
            return new GoogleHomeConversation(props);
        }
    } else if (props.response) {
        const responsePayload = props.response.payload;
        if (responsePayload.response) {
            return new AlexaConversation(props);
        } else if (responsePayload.speech) {
            return new GoogleHomeConversation(props);
        }
    }
    return new GenericConversation(props); // Give up
}

export default Conversation;

/**
 * A Generic Conversation is a conversation that does not have a known point of origin.
 * As such, we can't figure out what any of the data is based on the results, so we have a default
 * parameters supplied instead.  Some things are common among all logs, so they will be provided through this
 * class. Other Conversation classes can inherit from this class to use as for default values.
 */
class GenericConversation implements Conversation {

    readonly request: Log;

    readonly response: Log;

    readonly outputs: Output[];

    readonly stackTraces: StackTrace[];

    origin: Origin = Origin.AmazonAlexa;

    sessionId: string | undefined;
    userId: string | undefined;
    rawRequestType: string | undefined;
    requestType: string | undefined;
    requestPayloadType: string | undefined;
    intent: string | undefined;

    constructor(props: ConversationProperties) {
        this.request = props.request;
        this.response = props.response;
        this.outputs = props.outputs ? props.outputs.slice() : [];
        this.stackTraces = props.stackTraces ? props.stackTraces.slice() : [];
    }

    get id(): string | undefined {
        let id: string;
        if (this.request) {
            id = this.request.id;
        } else if (this.response) {
            id = this.response.id;
        }
        return id;
    }

    get userColors(): ConvoColors {

        // set the default
        let colors: ConvoColors = {
            fill: "#ffffff",
            background: "#000000"
        };

        if (this.userId) {
            let lastSix = this.userId.substr(this.userId.length - 6);

            // regex for checking hex
            let isHex = /(^[0-9a-fA-F]{6}$)/;

            if (isHex.test(lastSix)) {
                colors.fill = "#" + lastSix;
                colors.background = Color.complementaryColor(lastSix);
            } else {
                // not hex, try to convert it to hex
                let decimalValue = parseInt(lastSix, 36);
                let convertedHex = decimalValue.toString(16);
                let fill = convertedHex.substr(convertedHex.length - 6);

                if (isHex.test(fill)) {
                    colors.fill = "#" + fill;
                    colors.background = Color.complementaryColor(fill);
                }
            }
        }

        return colors;
    }

    get timestamp(): Date | undefined {

        let timeStamp: Date;

        if (this.request) {
            timeStamp = this.request.timestamp;
        } else if (this.response) {
            timeStamp = this.response.timestamp;
        }

        return timeStamp;
    }

    get hasError(): boolean {
        return this.isType("ERROR") || this.hasOutputType("ERROR");
    }

    get hasException(): boolean {
        return this.stackTraces.length > 0;
    }

    isType(type: ConversationLevel | string): boolean {
        return (this.request && this.request.log_type === type) || (this.response && this.response.log_type === type);
    }

    hasOutputType(type: string): boolean {
        for (let output of this.outputs) {
            if (output.level === type) {
                return true;
            }
        }
        return false;
    }
}

class AlexaConversation extends GenericConversation {

    readonly source: Origin = Origin.AmazonAlexa;

    constructor(props: ConversationProperties) {
        super(props);
    }

    get sessionId(): string | undefined {
        let sessionId: string;
        if (this.request) {
            if (typeof this.request.payload === "object") {
                sessionId = this.request.payload.session.sessionId;
            }
        }
        return sessionId;
    }

    get userId(): string | undefined {

        let userId: string;

        if (this.request) {
            if (typeof this.request.payload === "object") {
                if (this.request.payload.session && this.request.payload.session.user) {
                    userId = this.request.payload.session.user.userId;
                } else if (this.request.payload.context && this.request.payload.context.System.user) {
                    userId = this.request.payload.context.System.user.userId;
                }
            }
        }

        return userId;
    }

    get rawRequestType(): string | undefined {
        let requestType: string;

        if (this.request && this.request.payload.request) {
            requestType = this.request.payload.request.type;
        }

        return requestType;
    }

    get requestType(): string | undefined {
        let requestType: string = this.rawRequestType;

        if (requestType) {
            requestType = requestType.split(".")[0];
        }

        return requestType;
    }

    get requestPayloadType(): string | undefined {
        let requestType: string = this.rawRequestType;

        // if it is an intent request, append the type
        if (requestType === "IntentRequest") {
            requestType = requestType + "." + this.intent;
        }

        return requestType;
    }

    get intent(): string | undefined {
        if (this.request && this.request.payload.request && this.request.payload.request.intent) {
            return this.request.payload.request.intent.name;
        } else {
            const requestType = this.rawRequestType;
            const splitTypes = (requestType) ? requestType.split(".", 2) : undefined;
            if (splitTypes !== undefined && splitTypes.length > 1) {
                return splitTypes[1];
            } else {
                return undefined;
            }
        }
    }
}

class GoogleHomeConversation extends GenericConversation {

    readonly origin: Origin = Origin.GoogleHome;

    constructor(props: ConversationProperties) {
        super(props);
    }

    get sessionId(): string | undefined {
        let sessionId: string;
        if (this.request) {
            if (typeof this.request.payload === "object") {
                sessionId = this.request.payload.sessionId;
            }
        }
        return sessionId;
    }

    get userId(): string | undefined {
        let userId: string;
        if (this.request) {
            if (this.request.payload) {
                const payload = this.request.payload;
                if (payload.originalRequest) {
                    const originalRequest = payload.originalRequest;
                    if (originalRequest.data) {
                        const data = originalRequest.data;
                        if (data.user) {
                            userId = data.user.user_id;
                        }
                    }
                }
            }
        }
        return userId;
    }

    get rawRequestType(): string | undefined {
        return this.intent; // Turns out they may be the same thing for Google Home.
    }

    get requestType(): string | undefined {
        let requestType: string = this.rawRequestType;

        if (requestType) {
            requestType = requestType.split(".")[0];
        }

        return requestType;
    }

    get requestPayloadType(): string | undefined {
        let requestType: string = this.rawRequestType;

        // if it is an intent request, append the type
        if (requestType === "IntentRequest") {
            requestType = requestType + "." + this.intent;
        }

        return requestType;
    }

    get intent(): string | undefined {

        let intent: string;

        if (this.request) {
            if (this.request.payload) {
                const payload = this.request.payload;
                if (payload.originalRequest) {
                    const originalRequest = payload.originalRequest;
                    if (originalRequest.data) {
                        const data = originalRequest.data;
                        if (data.inputs && data.inputs.length > 0) {
                            const firstInput = data.inputs[0];
                            intent = firstInput.intent;
                        }
                    }
                }
            }
        }

        return intent;
    }
}