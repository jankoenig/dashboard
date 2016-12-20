
interface DatePeriodProperties {
    startDate?: Date;
    endDate?: Date;
}

class DatePeriod implements DatePeriodProperties {
    readonly startDate: Date;

    readonly endDate: Date;

    constructor(props: DatePeriodProperties) {
        this.startDate = props.startDate;
        this.endDate = props.endDate;
    }

}

export default DatePeriod;