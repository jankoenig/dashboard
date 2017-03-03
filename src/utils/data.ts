import * as d3_scale from "d3-scale";
import * as d3_time from "d3-time";
import * as moment from "moment";

import { TimeSeriable, TimeSeriesDatum } from "../models/time-series";
import DateUtil from "./date";

namespace DataUtil {

    /**
     * Get the ticks, used by a graph, of a provided set of time series data by day.
     *
     * Help from http://jsfiddle.net/1vzc18qt/
     *
     * Note: This method is similar to DateUtil.timeBuckets and we may
     *       want to consolidate these in the future.  We may be able to
     *       remove the DateUtil all together since its usage is
     *       relatively small.  Leveraging d3 for time buckets and scales
     *       is less code we have to write and maintain.
     *
     * @export
     * @param {TimeSeriesDatum[]} data
     * @returns {number[]} An array of universal time numbers corresponding to the ticks
     */
    export function getDayTicks(data: TimeSeriesDatum[]): number[] {
        if (!data || data.length === 0) {
            return [];
        }

        const domain = [data[0].date, data[data.length - 1].date];
        const scale = d3_scale.scaleTime().domain(domain).range([0, 1]);
        const ticks = scale.ticks(d3_time.timeDay);

        return ticks.map(entry => +entry);
    }

    export const timeseriesHourFormatKey = "Y-M-D HH";

    export const timeseriesDayFormatKey = "Y-M-D";

    const keyFormat = {
        ["days"]: timeseriesDayFormatKey,
        ["hours"]: timeseriesHourFormatKey
    };

    /**
     * Converts an array of data, that has a timestamp: Date property, to an array of the data organized by buckets either by the hour or the day.
     *
     * @export
     * @template T
     * @param {("days" | "hours")} bucketSize
     * @param {Date} startTime
     * @param {Date} endTime
     * @param {T[]} data
     * @returns {TimeSeriesDatum[]}
     */
    export function convertToTimeSeries<T extends TimeSeriable>(bucketSize: "days" | "hours", startTime: Date | moment.Moment, endTime: Date | moment.Moment, data: T[]): TimeSeriesDatum[] {

        let dataMap: { [time: string]: T[] } = {};
        let timeSeriesData: TimeSeriesDatum[] = [];
        let timeSeriesBuckets = DateUtil.timeBuckets(startTime, endTime, bucketSize);

        const keyformat = keyFormat[bucketSize];

        // From the time buckets, create a map of empty arrays with a common time stamp
        for (let time of timeSeriesBuckets) {
            let key = moment(time).format(keyformat);
            dataMap[key] = [];
        }

        // For each conversation, push the event to the corresponding bucket
        for (let datum of data) {
            let key = moment(datum.timestamp).format(keyformat);
            const map = dataMap[key];
            if (map) {
                map.push(datum);
            } // Else the conversation time is outside of the range.
        }

        // And finally, push each timestamp key to the events array with how many events occured on that day
        for (let key in dataMap) {
            let datum = new TimeSeriesDatum({
                date: moment(key, keyformat).toDate(),
                data: dataMap[key]
            });
            timeSeriesData.push(datum);
        }

        return timeSeriesData;
    }
}

export default DataUtil;