
import DataUtil from "../utils/data";

interface SourceSummary {
    startTime: Date;
    endTime: Date;

    totalUniqueUsers: number;

    totalCrashes: number;

    events: DataUtil.TimeSeriesDatum[];
    totalEvents: number;
    eventLabel: string;
}

export default SourceSummary;