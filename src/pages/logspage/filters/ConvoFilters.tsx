import * as moment from "moment";

import Conversation, { Origin } from "../../../models/conversation";
import StringUtils from "../../../utils/string";
import { Filter } from "./Filters";

export const TYPE_LOG_LEVEL: string = "Log Level";
export const TYPE_ID: string = "ID";
export const TYPE_DATE: string = "Date";
export const TYPE_REQUEST: string = "Request";
export const TYPE_INTENT: string = "Intent";
export const TYPE_EXCEPTION: string = "Exception";
export const TYPE_ORIGIN: string = "Origin";
export const TYPE_USER_ID: string = "UserID";

export class LogLevelFilter implements Filter<Conversation> {
    logType?: string;
    type: string = TYPE_LOG_LEVEL;

    constructor(type?: string) {
        this.logType = type;
    }

    get filter(): (item: Conversation) => boolean {
        let type = this.logType;
        return function (item: Conversation): boolean {
            if (type === undefined || type.trim() === "") {
                return true;
            }
            return item !== undefined && (item.isType(type) || item.hasOutputType(type));
        };
    }
}

export class IDFilter implements Filter<Conversation> {
    id: string;
    type: string = "ID";

    constructor(id?: string) {
        this.id = id;
    }

    get filter(): (item: Conversation) => boolean {
        let id = (this.id) ? StringUtils.regexEscape(this.id) : "";
        let regex = new RegExp("^.*" + id + ".*$", "g");
        return function (item: Conversation): boolean {
            return item !== undefined && id !== undefined && regex.test(item.id);
        };
    }
}

export class DateFilter implements Filter<Conversation> {
    startMoment: moment.Moment;
    endMoment: moment.Moment;
    type: string = TYPE_DATE;

    constructor(startDate?: Date, endDate?: Date) {
        this.startMoment = (startDate) ? moment(startDate) : undefined;
        this.endMoment = (endDate) ? moment(endDate) : undefined;
    }

    get startDate(): Date {
        return this.startMoment.toDate();
    }

    get endDate(): Date {
        return this.endMoment.toDate();
    }

    get filter(): (item: Conversation) => boolean {
        let startMoment = this.startMoment;
        let endMoment = this.endMoment;
        return function (item: Conversation): boolean {
            if (item) {
                let created = moment(item.timestamp);
                let afterStart = startMoment === undefined || created.isSameOrAfter(startMoment);
                let beforeEnd = endMoment === undefined || created.isSameOrBefore(endMoment);
                return afterStart && beforeEnd;
            }
            return false;
        };
    }
}

export class IntentFilter implements Filter<Conversation> {
    intent: string | undefined;
    type: string = TYPE_INTENT;

    constructor(intent?: string) {
        this.intent = intent;
    }

    get filter(): (item: Conversation) => boolean {
        const intent = this.intent;
        return function (item: Conversation): boolean {
            if (!intent) {
                return true;
            }

            if (item && item.intent) {
                return checkString(intent, item.intent);
            } else {
                return false;
            }
        };
    }
}

export class UserIDFilter implements Filter<Conversation> {
    static type = TYPE_USER_ID;

    type: string = UserIDFilter.type;
    userID: string | undefined;

    constructor(userID?: string) {
        this.userID = userID;
    }

    get filter(): (item: Conversation) => boolean {
        const userId = this.userID;
        return function (item: Conversation): boolean {
            if (!userId) {
                return true;
            }

            if (item && item.userId) {
                return checkString(userId, item.userId);
            } else {
                return false;
            }
        };
    }
}

export class RequestFilter implements Filter<Conversation> {
    request: string | undefined;
    type: string = TYPE_REQUEST;

    constructor(request?: string) {
        this.request = request;
    }

    get filter(): (item: Conversation) => boolean {
        const request = this.request;
        return function (item: Conversation): boolean {
            if (!request) {
                return true;
            }
            if (item && item.requestType) {
                return checkString(request, item.requestType);
            } else {
                return false;
            }
        };
    }
}

export class ExceptionFilter implements Filter<Conversation> {
    type: string = TYPE_EXCEPTION;

    get filter(): (item: Conversation) => boolean {
        return function (item: Conversation): boolean {
            return item.hasException;
        };
    }
}

export class OriginFilter implements Filter<Conversation> {
    type: string = TYPE_ORIGIN;
    origin: Origin;

    constructor(origin: Origin) {
        this.origin = origin;
    }

    get filter(): (item: Conversation) => boolean {
        const origin = this.origin;
        return function (item: Conversation): boolean {
            return origin === undefined || origin === item.origin;
        };
    }
}

function checkString(original: string, isLike: string): boolean {
    const regex = new RegExp(original.replace(/(\W)/g, "\\$1"), "gi");
    const match = isLike.match(regex);
    // Match throws a null instead of undefined so we're going to have to go with that.
    /* tslint:disable:no-null-keyword */
    return match !== null && match.length > 0;
    /* tslint:enable:no-null-keyword*/
}