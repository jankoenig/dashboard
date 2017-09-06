import * as moment from "moment";
import * as React from "react";

import IntervalChart, { IntervalData } from "../../components/Graphs/Line/IntervalChart";
import * as LoadingComponent from "../../components/LoadingComponent";
import Query, { EndTimeParameter, IntervalParameter, SourceParameter, StartTimeParameter } from "../../models/query";
import Source from "../../models/source";
import LogService from "../../services/log";
import SourceUtils from "../../utils/Source";

interface SourceResponseTimeAverageProps extends LoadingComponent.LoadingComponentProps {
    source: Source;
    startDate: moment.Moment;
    endDate: moment.Moment;
    interval: number;
    refreshInterval?: number;
}

interface SourceResponseTimeAverageState extends LoadingComponent.LoadingComponentState<IntervalData[]> {
  intervalArray: IntervalData[];
  refreshId?: any;
}

export class SourceResponseTimeAverage extends LoadingComponent.Component<IntervalData[], SourceResponseTimeAverageProps, SourceResponseTimeAverageState> {

    static defaultProps: SourceResponseTimeAverageProps = {
        source: undefined,
        startDate: moment().subtract(7, "days"),
        endDate: moment(),
        interval: 5,
        refreshInterval: 60000,
    };

    constructor(props: SourceResponseTimeAverageProps) {
      super(props, { data: [] } as SourceResponseTimeAverageState);
    }

    componentDidMount () {
        this.props.refreshInterval && this.setState({...this.state, refreshId: setInterval(() => this.refresh(), this.props.refreshInterval)});
    }

    componentWillUnmount () {
        clearInterval(this.state.refreshId);
    }

    async refresh () {
        const { source, startDate, endDate } = this.props;

        if (!source) return;
        this.mapState({ data: [] });
        const query: Query = new Query();
        query.add(new SourceParameter(source));
        query.add(new StartTimeParameter(startDate));
        query.add(new EndTimeParameter(endDate));
        const serviceData: any = await LogService.getResponseTimeSummary(query);
        this.mapState({data: serviceData});
    }

    shouldUpdate(oldProps: SourceResponseTimeAverageProps, newProps: SourceResponseTimeAverageProps) {
        if (!newProps) {
            return true;
        } else {
            return !SourceUtils.equals(newProps.source, oldProps.source)
                || !newProps.startDate.isSame(oldProps.startDate)
                || !newProps.endDate.isSame(oldProps.endDate);
        }
    }

    preLoad(props: SourceResponseTimeAverageProps) {
        return this.mapState({ data: []});
    }

    startLoading(props: SourceResponseTimeAverageProps): Thenable<LogService.ResponseTimeSummary> {
        const { source, startDate, endDate, interval } = props;

        if (!source) {
            return Promise.resolve({});
        }

        const query: Query = new Query();
        query.add(new SourceParameter(source));
        query.add(new StartTimeParameter(startDate));
        query.add(new EndTimeParameter(endDate));
        query.add(new IntervalParameter(interval));
        return LogService.getResponseTimeSummary(query);
    }

    map(data: LogService.ResponseTimeSummary[]): any {
      return data;
    }

    onLoadError(err: Error) {
        return this.mapState({ intervalArray: [] });
    }

    render() {
        const { data } = this.state;
        return (
            <IntervalChart
                startDate={this.props.startDate}
                endDate={this.props.endDate}
                data={data} />
        );
    }
}

export default SourceResponseTimeAverage;
