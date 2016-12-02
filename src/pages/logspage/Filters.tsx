
import Log from "../../models/log";

export interface FilterType {
    type: string;
    filter: (item: Log) => boolean;
}

export class TypeFilter implements FilterType {
    logType?: string;

    constructor() {
        this.logType = undefined;
    }

    get type(): string {
        return "Log Type";
    }

    get filter(): (item: Log) => boolean {
        let type = this.logType;
        return function(item: Log): boolean {
            if (!type || type.trim() === "") {
                return true;
            }
            let match = item.log_type.match(type);
            return match && match.length > 0;
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

    get filter(): (item: Log) => boolean {
        let id = this.id;
        return function (item: Log): boolean {
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

    get filter(): (item: Log) => boolean {
        return function (item: Log): boolean {
            let created = item.timestamp;
            return this.startDate <= created && created <= this.endDate;
        };
    }
}