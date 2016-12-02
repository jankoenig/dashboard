
import Conversation from "../../models/Conversation";

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
    startDate: Date;
    endDate: Date;

    constructor() {
        this.startDate = this.endDate = new Date();
    }

    get type(): string {
        return "Date";
    }

    get filter(): (item: Conversation) => boolean {
        return function (item: Conversation): boolean {
            let created = item.timestamp;
            return this.startDate <= created && created <= this.endDate;
        };
    }
}