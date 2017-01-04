
import { TimeSeriesDatum } from "./time-series";

interface SourceSummary {

    startTime: Date;

    endTime: Date;

    totalUniqueUsers: number;

    totalCrashes: number;

    events: TimeSeriesDatum[];

    totalEvents: number;

    eventLabel: string;
}

export default SourceSummary;