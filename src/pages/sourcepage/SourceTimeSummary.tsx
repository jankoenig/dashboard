import * as moment from "moment";
import * as React from "react";

import TimeChart, { LineProps, TimeData } from "../../components/Graphs/Line/TimeChart";
import Query, { EndTimeParameter, FillGapsParameter, GranularityParameter, SortParameter, SourceParameter, StartTimeParameter } from "../../models/query";
import Source from "../../models/source";
import LogService from "../../services/log";
import { AMAZON_ORANGE, BLACK, GOOGLE_GREEN } from "../../utils/colors";
import { DataLoader, DataState, GenericStateHandler, Loader } from "./DataLoader";

interface SourceTimeSummaryProps {
    source: Source;
    startDate: moment.Moment;
    endDate: moment.Moment;
    lineProps?: LineProps[];
}

interface SourceTimeSummaryState {
    timeData: TimeData[];
    timeLoaded: DataState;
}

class TimeSortParameter extends SortParameter {
    parameter = "date_sort";
}

export class SourceTimeSummary extends React.Component<SourceTimeSummaryProps, SourceTimeSummaryState> {
    static lines: LineProps[] = [{
        dataKey: "total",
        name: "Total",
        stroke: BLACK
    }, {
        dataKey: "Amazon.Alexa",
        name: "Alexa",
        stroke: AMAZON_ORANGE
    }, {
        dataKey: "Google.Home",
        name: "Home",
        stroke: GOOGLE_GREEN
    }];

    static defaultProps: SourceTimeSummaryProps = {
        source: undefined,
        startDate: moment().subtract(7, "days"),
        endDate: moment(),
        lineProps: SourceTimeSummary.lines
    };

    constructor(props: SourceTimeSummaryProps) {
        super(props);

        this.state = {
            timeData: [],
            timeLoaded: DataState.LOADING
        };
    }

    componentWillReceiveProps(nextProps: SourceTimeSummaryProps, context: any) {
        if (nextProps.source) {
            this.retrieveTimeSummary(nextProps.source, nextProps.startDate, nextProps.endDate);
        }
    }

    retrieveTimeSummary(source: Source, start: moment.Moment, end: moment.Moment) {
        const dataLoader: DataLoader<LogService.TimeSummary, PageTimeData[]> = {
            loadData: function (query: Query): Promise<LogService.TimeSummary> {
                return LogService.getTimeSummary(query);
            },
            map: function (data: LogService.TimeSummary): any[] {
                const mergedData = mergeTimeSummary(data);
                return mergedData;
            },
        };

        const callback: GenericStateHandler<PageTimeData[]> = new GenericStateHandler(this.state, "timeLoaded", "timeData", this.setState.bind(this));
        const onLoaded = callback.onLoaded.bind(callback);
        callback.onLoaded = function (data: PageTimeData[]) {
            if (data.length === 0) {
                data = defaultPageTimeData(start, end);
            }
            onLoaded(data);
        };
        const loader: Loader = new Loader(dataLoader, callback, callback);

        const query: Query = new Query();
        query.add(new SourceParameter(source));
        query.add(new StartTimeParameter(start));
        query.add(new EndTimeParameter(end));
        query.add(new GranularityParameter("hour"));
        query.add(new TimeSortParameter("asc"));
        query.add(new FillGapsParameter(true));

        loader.load(query);
    }

    render() {
        return (
            <TimeChart
                data={this.state.timeData}
                lines={this.props.lineProps} />
        );
    }
}

export default SourceTimeSummary;

class PageTimeData extends TimeData {
    total?: number;
    "Amazon.Alexa"?: number;
    "Google.Home"?: number;

    constructor(time: Date | moment.Moment) {
        super(time);
        this["total"] = 0;
        this["Amazon.Alexa"] = 0;
        this["Google.Home"] = 0;
    }
}

function defaultPageTimeData(start: moment.Moment, end: moment.Moment): PageTimeData[] {
    let data: PageTimeData[] = [];
    let currentDate: moment.Moment = start.clone();
    while (currentDate.isBefore(end)) {
        const newData: PageTimeData = new PageTimeData(currentDate);
        newData.total = 0;
        newData["Amazon.Alexa"] = 0;
        newData["Google.Home"] = 0;
        data.push(newData);
        currentDate.add(1, "days");
    }
    return data;
}

function mergeTimeSummary(summary: LogService.TimeSummary): PageTimeData[] {
    const merger: any = {};
    for (let bucket of summary.buckets) {
        const date = new Date(bucket.date);
        date.setMinutes(0, 0, 0);
        const dateString = date.toISOString();
        const newObj: PageTimeData = new PageTimeData(date);
        newObj["total"] = bucket.count;
        newObj["Amazon.Alexa"] = 0;
        newObj["Google.Home"] = 0;
        merger[dateString] = newObj;
    }

    joinBuckets(merger, summary.amazonBuckets, "Amazon.Alexa");
    joinBuckets(merger, summary.googleBuckets, "Google.Home");

    const values = Object.keys(merger).map(key => merger[key]);
    return values;
}

function joinBuckets(merger: any, buckets: LogService.TimeBucket[], key: "total" | LogService.Origin) {
    for (let bucket of buckets) {
        const date = new Date(bucket.date);
        date.setMinutes(0, 0, 0);
        const dateString = date.toISOString();
        let obj: PageTimeData = merger[dateString];
        if (!obj) {
            obj = new PageTimeData(date);
            obj["total"] = bucket.count;
            obj["Amazon.Alexa"] = 0;
            obj["Google.Home"] = 0;
        }
        obj[key] = bucket.count;
        merger[dateString] = obj;
    }
}