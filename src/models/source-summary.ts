
import { TimeSeriesDatum } from "./time-series";

export interface SummaryDatum {
    readonly name: string;
    readonly total: number;
}

interface SourceSummary {

    readonly startTime: Date;

    readonly endTime: Date;

    readonly totalUniqueUsers: number;

    readonly totalExceptions: number;

    readonly events: TimeSeriesDatum[];

    readonly totalEvents: number;

    readonly eventLabel: string;

    readonly requests: SummaryDatum[];
}

export default SourceSummary;