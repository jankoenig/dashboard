import Source from "./source";

export interface QueryParameter {
    parameter: string;
    value: any;
}

export class Query {
    queryElements: QueryParameter[];

    constructor() {
        this.queryElements = [];
    }

    add(element: QueryParameter): Query {
        this.queryElements.push(element);
        return this;
    }

    query(): string {
        const elements = this.queryElements;
        if (elements.length > 0) {
            const first = elements[0];
            let q: string = first.parameter + "=" + first.value;
            for (let i = 1; i < elements.length; ++i) {
                const next = elements[i];
                q += "&" + next.parameter + "=" + next.value;
            }
            return q;
        }
        return "";
    }
}

export default Query;

export class SourceParameter implements QueryParameter {
    constructor(source: string | Source) {
        this.value = (source instanceof Source) ? source.secretKey : source;
    }

    readonly value: string;

    parameter = "source";
}

export class TimeParameter implements QueryParameter {
    readonly time: string;

    constructor(time: Date) {
        this.value = time.toISOString();
    }

    readonly value: string;

    parameter = "time";
}

export class StartTimeParameter extends TimeParameter {
    parameter = "start_time";
}

export class EndTimeParameter extends TimeParameter {
    parameter = "end_time";
}

export class LimitParameter implements QueryParameter {
    constructor(limit: number) {
        this.value = limit;
    }

    readonly value: number;

    parameter = "limit";
}

export class SortParameter implements QueryParameter {
    constructor(sort: "asc" | "desc") {
        this.value = sort;
    }

    value: "asc" | "desc";

    parameter = "sortBy";
}

export class GranularityParameter implements QueryParameter {
    constructor(granularity: "day" | "hour") {
        this.value = granularity;
    }

    value: "day" | "hour";

    parameter = "granularity";
}