import Session from "./Session";
import { TimeSeriesDatum } from "./time-series";

export interface SummaryDatum {
    name: string;
    total: number;
}

interface SourceSummary {

    startTime: Date | moment.Moment;

    endTime: Date | moment.Moment;

    totalUniqueUsers: number;

    totalExceptions: number;

    events: TimeSeriesDatum[];

    totalEvents: number;

    eventLabel: string;

    requestSummary: SummaryDatum[];

    sessionSummary: SummaryDatum[];

    sessions: Session[];
}

export default SourceSummary;