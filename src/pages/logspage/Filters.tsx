import * as moment from "moment";

import Conversation from "../../models/conversation";

export interface FilterType {
    type: string;
    filter: (item: Conversation) => boolean;
}

export class TypeFilter implements FilterType {
    logType?: string;

    constructor() {
        this.logType = undefined;
    }

    get type(): string {
        return "Log Type";
    }

    get filter(): (item: Conversation) => boolean {
        let type = this.logType;
        return function(item: Conversation): boolean {
            if (!type || type.trim() === "") {
                return true;
            }
            return item.hasType(type);
        };
    }
}

export class IDFilter implements FilterType {
    id: string;

    constructor() {
        this.id = "";
    }

    get type(): string {
        return "ID";
    }

    get filter(): (item: Conversation) => boolean {
        let id = this.id;
        return function (item: Conversation): boolean {
            let matches = item.id.match("^.*" + id + ".*$");
            return id.length === 0 || (matches && matches.length > 0);
        };
    }
}

export class DateFilter implements FilterType {
    startDate: moment.Moment;
    endDate: moment.Moment;

    constructor() {
        this.startDate = this.endDate = moment();
    }

    get type(): string {
        return "Date";
    }

    get filter(): (item: Conversation) => boolean {
        let startDate = this.startDate;
        let endDate = this.endDate;
        return function (item: Conversation): boolean {
            let created = moment(item.timestamp);
            let afterStart = startDate === undefined || created.isSameOrAfter(startDate);
            let beforeEnd = endDate === undefined || created.isSameOrBefore(endDate);
            return afterStart && beforeEnd;
        };
    }
}