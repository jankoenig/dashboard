
export interface EventDatum {
    timestamp: Date;
    events: number;
}

interface SourceSummary {
    startTime: Date;
    endTime: Date;

    totalUniqueUsers: number;

    totalCrashes: number;

    events: EventDatum[];
    totalEvents: number;
    eventLabel: string;
}

export default SourceSummary;