

export interface TimeSeriable {
    readonly timestamp: Date;
}

export interface TimeSeriesDatumProps {
    readonly date: Date;
    readonly data: TimeSeriable[];
}

export class TimeSeriesDatum {
    readonly data: TimeSeriable[];
    readonly date: Date;

    constructor(props: TimeSeriesDatumProps) {
        this.date = props.date;
        this.data = props.data;
    }

    get time(): number {
        return this.date.getTime();
    }

    get length(): number {
        return this.data.length;
    }
}