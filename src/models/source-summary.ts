import StackTrace from "./stack-trace";

export interface CrashDatum {
    timestamp: Date;
    stackTrace: StackTrace;
}

export interface EventDatum {
    timestamp: Date;
    event: string;
}

interface SourceSummary {
    startTime: Date;
    endTime: Date;
    uniqueUsers: string[];
    crashes: CrashDatum[];
    events: EventDatum[];
}

export default SourceSummary;