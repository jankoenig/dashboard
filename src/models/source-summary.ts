
import { TimeSeriesDatum } from "./time-series";

export interface SummaryDatum {
    name: string;
    total: number;
}

interface SourceSummary {

    startTime: Date;

    endTime: Date;

    totalUniqueUsers: number;

    totalExceptions: number;

    events: TimeSeriesDatum[];

    totalEvents: number;

    eventLabel: string;

    requests: SummaryDatum[];

    sessions: SummaryDatum[];
}

export default SourceSummary;