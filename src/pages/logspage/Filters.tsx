import * as moment from "moment";

import Conversation from "../../models/conversation";
import StringUtils from "../../utils/string";

export const TYPE_COMPOSITE: string = "Composite";
export const TYPE_LOG_LEVEL: string = "Log Level";
export const TYPE_ID: string = "ID";
export const TYPE_DATE: string = "Date";
export const TYPE_REQUEST: string = "Request";
export const TYPE_INTENT: string = "Intent";
export const TYPE_EXCEPTION: string = "Exception";

export interface FilterType {
    type: string;
    filter: (item: Conversation) => boolean;
}

/**
 * Composite filter is an immutable object of Filters in which it will only return "true"
 * when all filters pass.
 *
 * It is designed with the assumption that there will only be one filter for each type.
 * This is not enforced in the constructor, but the other methods assume this so it is the user's
 * responsibility to ensure that it is true.
 */
export class CompositeFilter implements FilterType {
    filters: FilterType[];
    type: string = TYPE_COMPOSITE;

    constructor(filters: FilterType[]) {
        this.filters = filters;
    }

    /**
     * creates a new CompositeFilter with the added filter.
     */
    copyAndAddOrReplace(filter: FilterType): CompositeFilter {
        let copy = this.filters.slice();
        for (let i = 0; i < this.filters.length; ++i) {
            if (this.filters[i].type === filter.type) {
                copy.splice(i, 1);
            }
        }
        copy.push(filter);
        return new CompositeFilter(copy);
    }

    getFilter(type: string): FilterType | undefined {
        for (let filterType of this.filters) {
            if (filterType.type === type) {
                return filterType;
            }
        }
        return undefined;
    }

    get filter(): (item: Conversation) => boolean {
        let filters = this.filters;
        return function (item: Conversation): boolean {
            for (let filter of filters) {
                if (!filter.filter(item)) {
                    return false;
                }
            }
            return true;
        };
    }
}

export class LogLevelFilter implements FilterType {
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

export class IDFilter implements FilterType {
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

export class DateFilter implements FilterType {
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

export class IntentFilter implements FilterType {
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

export class RequestFilter implements FilterType {
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

export class ExceptionFilter implements FilterType {
    type: string = TYPE_EXCEPTION;

    get filter(): (item: Conversation) => boolean {
        return function (item: Conversation): boolean {
            return item.hasException;
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