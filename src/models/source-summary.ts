
import { TimeSeriesDatum } from "./time-series";

interface SourceSummary {

    startTime: Date;

    endTime: Date;

    totalUniqueUsers: number;

    totalExceptions: number;

    events: TimeSeriesDatum[];

    totalEvents: number;

    eventLabel: string;
}

export default SourceSummary;