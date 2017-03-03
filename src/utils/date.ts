import * as moment from "moment";

export namespace DateUtil {
    export function daysAgo(days: number): Date {
        return moment().subtract(days, "days").toDate();
    }

    export function hoursAgo(hours: number): Date {
        return moment().subtract(hours, "hours").toDate();
    }

    export function timeBuckets(start: Date | moment.Moment, end: Date | moment.Moment, interval: "days" | "hours"): Date[] {

        let buckets: Date[] = [];

        for (let m = moment(start); m.isBefore(end, interval) || m.isSame(end, interval); m.add(1, interval)) {
            buckets.push(m.startOf(interval).toDate());
        }

        return buckets;

    }
}

export default DateUtil;