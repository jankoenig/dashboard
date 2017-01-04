

export interface TimeSeriable {
    timestamp: Date;
}

export interface TimeSeriesDatumProps {
    date: Date;
    data: TimeSeriable[];
}

export class TimeSeriesDatum implements TimeSeriesDatum {

    readonly date: Date;

    get time(): number {
        return this.date.getTime();
    }

    readonly data: TimeSeriable[];

    get length(): number {
        return this.data.length;
    }

    constructor(props: TimeSeriesDatumProps) {
        this.date = props.date;
        this.data = props.data;
    }
}