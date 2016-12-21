import * as moment from "moment";

import DateUtil from "./date";

namespace DataUtil {

    export const timeseriesHourFormatKey = "Y-M-D HH";
    export const timeseriesDayFormatKey = "Y-M-D";

    const keyFormat = {
        ["days"]: timeseriesDayFormatKey,
        ["hours"]: timeseriesHourFormatKey
    };

    export interface TimeSeriable {
        timestamp: Date;
    }

    export interface TimeSeriesDatum {
        bucket: Date;
        data: TimeSeriable[];
    }

    export function convertToTimeSeries<T extends TimeSeriable>(bucketSize: "days" | "hours", startTime: Date, endTime: Date, data: T[]): TimeSeriesDatum[] {

        let dataMap: { [time: string]: T[] } = {};
        let timeSeriesData: { bucket: Date, data: T[] }[] = [];
        let timeSeriesBuckets = DateUtil.timeBuckets(startTime, endTime, bucketSize);

        // From the time buckets, create a map of empty arrays with a common time stamp
        for (let time of timeSeriesBuckets) {
            let key = moment(time).format(keyFormat[bucketSize]);
            dataMap[key] = [];
        }

        // For each conversation, push the event to the corresponding bucket
        for (let datum of data) {
            let key = moment(datum.timestamp).format(keyFormat[bucketSize]);
            dataMap[key].push(datum);
        }

        // And finally, push each timestamp key to the events array with how many events occured on that day
        for (let key in dataMap) {
            timeSeriesData.push({
                bucket: moment(key, keyFormat[bucketSize]).toDate(),
                data: dataMap[key]
            });
        }

        return timeSeriesData;

    }
}

export default DataUtil;