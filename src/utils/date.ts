
export namespace DateUtil {
    export function daysAgo(days: number): Date {
        let newDate = new Date();
        newDate.setDate(newDate.getDate() - days);
        return newDate;
    }
}

export default DateUtil;