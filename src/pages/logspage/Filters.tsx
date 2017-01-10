import * as moment from "moment";

import Conversation from "../../models/conversation";
import StringUtils from "../../utils/string";

export const TYPE_DATE: string = "Date";

export interface FilterType {
    type: string;
    filter: (item: Conversation) => boolean;
}

export class CompositeFilter implements FilterType {
    filters: FilterType[];

    constructor(filters: FilterType[]) {
        this.filters = filters;
    }

    getFilter(type: string): FilterType | undefined {
        for (let filterType of this.filters) {
            if (filterType.type === type) {
                return filterType;
            }
        }
        return undefined;
    }

    get type(): string {
        return "Composite";
    }

    get filter(): (item: Conversation) => boolean {
        let filters = this.filters;
        return function(item: Conversation): boolean {
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

    constructor(type?: string) {
        this.logType = type;
    }

    get type(): string {
        return "Log Level";
    }

    get filter(): (item: Conversation) => boolean {
        let type = this.logType;
        return function(item: Conversation): boolean {
            if (type === undefined || type.trim() === "") {
                return true;
            }
            return item !== undefined && item.hasOutputType(type);
        };
    }
}

export class IDFilter implements FilterType {
    id: string;

    constructor(id?: string) {
        this.id = id;
    }

    get type(): string {
        return "ID";
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

    constructor(startDate?: Date, endDate?: Date) {
        this.startMoment = (startDate) ? moment(startDate) : undefined;
        this.endMoment = (endDate) ? moment(endDate) : undefined;
    }

    get type(): string {
        return TYPE_DATE;
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