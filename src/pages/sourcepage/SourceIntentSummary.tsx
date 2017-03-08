import * as moment from "moment";
import * as React from "react";

import BarChart, { BarProps, CountData } from "../../components/Graphs/Bar/CountChart";
import Query, { EndTimeParameter, SortParameter, SourceParameter, StartTimeParameter } from "../../models/query";
import Source from "../../models/source";
import LogService from "../../services/log";
import { AMAZON_ORANGE, GOOGLE_GREEN } from "../../utils/colors";
import { DataLoader, DataState, GenericStateHandler, Loader } from "./DataLoader";

interface SourceIntentSummaryProps {
    source: Source;
    startDate: moment.Moment;
    endDate: moment.Moment;
}

interface SourceIntentSummaryState {
    intentData: CountData[];
    intentLoaded: DataState;
}

class IntentSortParameter extends SortParameter {
    parameter = "count_sort";
}

export class SourceIntentSummary extends React.Component<SourceIntentSummaryProps, SourceIntentSummaryState> {
    static bars: BarProps[] = [{
        dataKey: "Amazon.Alexa",
        name: "Alexa",
        fill: AMAZON_ORANGE,
        stackId: "a"
    }, {
        dataKey: "Google.Home",
        name: "Home",
        fill: GOOGLE_GREEN,
        stackId: "a"
    }];

    static defaultProps: SourceIntentSummaryProps = {
        source: undefined,
        startDate: moment().subtract(7, "days"),
        endDate: moment()
    };

    constructor(props: SourceIntentSummaryProps) {
        super(props);

        this.setState = this.setState.bind(this);

        this.state = {
            intentData: [],
            intentLoaded: DataState.LOADING
        };
    }

    componentWillReceiveProps(nextProps: SourceIntentSummaryProps, context: any) {
        if (nextProps.source) {
            this.retrieveIntentSummary(nextProps.source, nextProps.startDate, nextProps.endDate);
        } else {
            this.setState({
                intentData: [],
                intentLoaded: DataState.LOADED
            });
        }
    }

    retrieveIntentSummary(source: Source, start: moment.Moment, end: moment.Moment) {
        const dataLoader: DataLoader<LogService.IntentSummary, IntentCountData[]> = {
            loadData: function (query: Query): Promise<LogService.IntentSummary> {
                return LogService.getIntentSummary(query);
            },
            map: function (data: LogService.IntentSummary): IntentCountData[] {
                return mergeIntentSummary(data);
            }
        };

        const callback: GenericStateHandler<IntentCountData[]> = new GenericStateHandler(this.state, "intentLoaded", "intentData", this.setState);
        const loader: Loader<LogService.IntentSummary, IntentCountData[]> = new Loader<LogService.IntentSummary, IntentCountData[]>(dataLoader, callback, callback);

        const query: Query = new Query();
        query.add(new SourceParameter(source));
        query.add(new StartTimeParameter(start));
        query.add(new EndTimeParameter(end));
        query.add(new IntentSortParameter("desc"));

        loader.load(query);
    }

    render() {
        const { intentData } = this.state;
        return (
            <div style={{ height: (intentData.length * 40) + 100 }} >
                <BarChart
                    data={intentData}
                    bars={SourceIntentSummary.bars}
                />
            </div>
        );
    }
}

export default SourceIntentSummary;

class IntentCountData implements CountData {
    title: string;
    count?: number;
    "Amazon.Alexa"?: number;
    "Google.Home"?: number;
}

function mergeIntentSummary(summary: LogService.IntentSummary): IntentCountData[] {
    let merger: any = {};
    for (let bucket of summary.count) {
        let obj = merger[bucket.name];
        if (!obj) {
            obj = new IntentCountData();
            obj["title"] = bucket.name;
            obj["count"] = 0; // Initial.  Will be added to.  It needs to include everything.
            merger[bucket.name] = obj;
        }
        obj[bucket.origin] = bucket.count;
        obj["count"] += bucket.count;
    }

    const values = Object.keys(merger).map(key => merger[key]);
    return values;
}