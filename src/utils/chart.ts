import * as moment from "moment";

export namespace ChartUtils {

    /**
     * Return the daily ticks of the provided data
     * @export
     * @param {array} data
     * @param {string} dateParamName
     * @returns
     */
    export function createTicks(data: any[], dateParamName: string) {
        let highest: moment.Moment = data.length ? moment(data[0][dateParamName]).startOf("day") : undefined;
        let lowest: moment.Moment = data.length ? moment(data[0][dateParamName]).startOf("day") : undefined;
        let ticks: number[] = data.length ? [ data[0][dateParamName].valueOf() ] : [];
        for (let i = 1; i < data.length; ++i) {
          const currentDate: moment.Moment = moment(data[i][dateParamName]).startOf("day");
          if (currentDate.isAfter(highest)) {
            ticks.push(data[i][dateParamName].valueOf());
            highest = currentDate;
          } else if (currentDate.isBefore(lowest)) {
            ticks.unshift(data[i][dateParamName].valueOf());
            lowest = currentDate;
          }
        }
        return ticks;
    }
}

export default ChartUtils;
